import os
import io
import zipfile
import sqlite3
import requests
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

app = FastAPI()

DB_PATH = os.getenv("DATABASE_URL", "/app/db/dev.db").replace("file:", "")
PASTA = Path("./dados_tmp")
PASTA.mkdir(exist_ok=True)

SESSION = requests.Session()
MAX_GET_RETRIES = 5
CHUNK_SIZE = 50000

USECOLS_SCR = ["data_base", "uf", "porte", "cliente",
    "carteira_inadimplencia", "carteira_vencida", "carteira_ativa", "vencido_acima_de_90_dias"]

NIVEIS_SALARIO = {
    "Acima de 20 salários mínimos": "A",
    "Mais de 10 a 20 salários mínimos": "A",
    "Mais de 5 a 10 salários mínimos": "B",
    "Mais de 3 a 5 salários mínimos": "C",
    "Mais de 2 a 3 salários mínimos": "D",
    "Mais de 1 a 2 salários mínimos": "D",
    "Até 1 salário mínimo": "E",
    "Sem rendimento": "E",
    "Grande": "A",
    "Médio": "B",
    "Pequeno": "C",
    "Micro": "D",
}

MAPA_REGIOES = {
    "AC": "Norte", "AM": "Norte", "AP": "Norte", "PA": "Norte",
    "RO": "Norte", "RR": "Norte", "TO": "Norte",
    "AL": "Nordeste", "BA": "Nordeste", "CE": "Nordeste", "MA": "Nordeste",
    "PB": "Nordeste", "PE": "Nordeste", "PI": "Nordeste", "RN": "Nordeste", "SE": "Nordeste",
    "DF": "Centro-Oeste", "GO": "Centro-Oeste", "MS": "Centro-Oeste", "MT": "Centro-Oeste",
    "ES": "Sudeste", "MG": "Sudeste", "RJ": "Sudeste", "SP": "Sudeste",
    "PR": "Sul", "RS": "Sul", "SC": "Sul",
}

ESTADOS_IBGE = {
    11: "RO", 12: "AC", 13: "AM", 14: "RR", 15: "PA", 16: "AP", 17: "TO",
    21: "MA", 22: "PI", 23: "CE", 24: "RN", 25: "PB", 26: "PE", 27: "AL",
    28: "SE", 29: "BA", 31: "MG", 32: "ES", 33: "RJ", 35: "SP",
    41: "PR", 42: "SC", 43: "RS", 50: "MS", 51: "MT", 52: "GO", 53: "DF",
    "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM",
    "Bahia": "BA", "Ceará": "CE", "Distrito Federal": "DF", "Espírito Santo": "ES",
    "Goiás": "GO", "Maranhão": "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG", "Pará": "PA", "Paraíba": "PB", "Paraná": "PR",
    "Pernambuco": "PE", "Piauí": "PI", "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN",
    "Rio Grande do Sul": "RS", "Rondônia": "RO", "Roraima": "RR", "Santa Catarina": "SC",
    "São Paulo": "SP", "Sergipe": "SE", "Tocantins": "TO",
}

MAP_IDADE_MEDIA = {
    "0 a 4 anos": 2.0, "5 a 9 anos": 7.0, "10 a 14 anos": 12.0, "15 a 19 anos": 17.0,
    "20 a 24 anos": 22.0, "25 a 29 anos": 27.0, "30 a 34 anos": 32.0, "35 a 39 anos": 37.0,
    "40 a 44 anos": 42.0, "45 a 49 anos": 47.0, "50 a 54 anos": 52.0, "60 a 64 anos": 62.0,
    "65 a 69 anos": 67.0, "70 a 74 anos": 72.0, "80 a 84 anos": 82.0, "85 a 89 anos": 87.0,
    "90 a 94 anos": 92.0, "95 a 99 anos": 97.0, "100 anos ou mais": 100.0,
}

LINKS_IBGE = {
    "taxa_escolarizacao": {
        "url": "https://apisidra.ibge.gov.br/values/t/7138/n3/all/v/10276/p/last%203/c2/6794/c58/100052,108866/d/v10276%201?formato=json",
        "use_cols": ["V", "D1N", "D3N"],
    },
    "censo_demografico": {
        "url": "https://apisidra.ibge.gov.br/values/t/4709/n1/all/n2/all/n3/all/v/all/p/all/d/v10605%202/l/p,v,t?formato=json",
        "use_cols": ["V", "D1N", "D2N", "D3N"],
    },
    "populacao_por_idade": {
        "url": "https://apisidra.ibge.gov.br/values/t/9514/n3/all/v/allxp/p/all/c2/6794/c287/6653,49108,49109,60040,60041,93070,93084,93085,93086,93087,93088,93089,93090,93091,93092,93093,93095,93096,93097/c286/113635?formato=json",
        "use_cols": ["V", "D1N", "D3N", "D5N"],
    },
}

filtro = ["ano_mes", "regiao", "uf"]


def get_db():
    return sqlite3.connect(DB_PATH)


def meses_existentes_por_origem(origem: str) -> set:
    try:
        con = get_db()
        cur = con.execute(
            'SELECT DISTINCT ano_mes FROM "EstruturaSrcPix" WHERE origem = ?', (origem,)
        )
        resultado = {str(row[0]) for row in cur.fetchall()}
        con.close()
        return resultado
    except Exception:
        return set()


def meses_existentes_db(tabela: str, coluna_mes: str) -> set:
    try:
        con = get_db()
        cur = con.execute(f'SELECT DISTINCT "{coluna_mes}" FROM "{tabela}"')
        resultado = {str(row[0]) for row in cur.fetchall()}
        con.close()
        return resultado
    except Exception:
        return set()


def gerar_todos_meses(inicio: str) -> list:
    data_atual = datetime.now()
    datas = pd.date_range(start=inicio, end=data_atual, freq="MS")
    return datas[:-1].strftime("%Y%m").tolist()


def deletar_meses(tabela: str, coluna_mes: str, meses: list, con: sqlite3.Connection, origem: str = None):
    if not meses:
        return
    placeholders = ",".join("?" * len(meses))
    if origem:
        con.execute(
            f'DELETE FROM "{tabela}" WHERE "{coluna_mes}" IN ({placeholders}) AND origem = ?',
            meses + [origem]
        )
    else:
        con.execute(
            f'DELETE FROM "{tabela}" WHERE "{coluna_mes}" IN ({placeholders})',
            meses
        )


def baixar_com_retry(url: str, timeout: int = 30):
    for i in range(1, MAX_GET_RETRIES + 1):
        try:
            r = SESSION.get(url, timeout=timeout)
            r.raise_for_status()
            r.encoding = "utf-8-sig"
            return r
        except Exception as e:
            if i == MAX_GET_RETRIES:
                raise e


def limpeza_string(df: pd.DataFrame, colunas: list = None) -> pd.DataFrame:
    if colunas is None:
        colunas = df.select_dtypes(include="object").columns.tolist()
    else:
        colunas = [c for c in colunas if c in df.columns and df[c].dtype == "object"]
    for col in colunas:
        df[col] = df[col].str.strip()
    return df


def converter_numerico(df: pd.DataFrame, *colunas) -> pd.DataFrame:
    for col in colunas:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
    return df


def formatar_numero(df: pd.DataFrame, colunas: list) -> pd.DataFrame:
    for col in colunas:
        if col in df.columns:
            df[col] = pd.to_numeric(
                df[col].astype(str).str.replace(",", ".", regex=False), errors="coerce"
            )
    return df


def limpar_nulos(df: pd.DataFrame) -> pd.DataFrame:
    numericas = df.select_dtypes(include="number").columns
    df[numericas] = df[numericas].fillna(df[numericas].median())
    categoricas = df.select_dtypes(include="object").columns
    df[categoricas] = df[categoricas].fillna("NAO_INFORMADO")
    return df


def formatar_data(df: pd.DataFrame, colunas: list) -> pd.DataFrame:
    for col in colunas:
        df[col] = pd.to_datetime(df[col], format="%Y-%m-%d").dt.strftime("%Y%m")
    return df


def converter_uf(df: pd.DataFrame, coluna: str) -> pd.DataFrame:
    df = df.rename(columns={coluna: "uf"})
    df["uf"] = df["uf"].map(ESTADOS_IBGE)
    return df


def converter_uf_para_regiao(df: pd.DataFrame, coluna: str) -> pd.DataFrame:
    df["regiao"] = df[coluna].map(MAPA_REGIOES)
    return df


def converter_porcentagem(df: pd.DataFrame, coluna: str) -> pd.DataFrame:
    df[coluna] = pd.to_numeric(df[coluna], errors="coerce") / 100
    return df


def normalizacao(df: pd.DataFrame, coluna: str) -> pd.DataFrame:
    col_max = df.groupby("ano_mes")[coluna].transform("max")
    col_min = df.groupby("ano_mes")[coluna].transform("min")
    denom = col_max - col_min
    df[coluna] = np.where(
        denom == 0, 1.0,
        (1 + (df[coluna] - col_min) / denom * 4).round(2)
    )
    return df


def tratamento_scr(df: pd.DataFrame) -> pd.DataFrame:
    df = limpar_nulos(df)
    df = formatar_numero(df, ["carteira_inadimplencia", "carteira_vencida",
                               "carteira_ativa", "vencido_acima_de_90_dias"])
    df = limpeza_string(df, ["data_base", "uf", "porte"])
    df = formatar_data(df, ["data_base"])
    df = converter_uf_para_regiao(df, "uf")
    df["porte"] = df["porte"].map(NIVEIS_SALARIO)
    return df


def tratamento_pix(df: pd.DataFrame) -> pd.DataFrame:
    df = limpar_nulos(df)
    df["AnoMes"] = df["AnoMes"].astype(str)
    df["Estado_Ibge"] = df["Estado_Ibge"].astype(str).str.extract(r"(\d+)")[0].astype(float).astype("Int64")
    df = converter_numerico(df, "VL_PagadorPF", "QT_PagadorPF",
                             "VL_PagadorPJ", "QT_PagadorPJ",
                             "QT_PES_PagadorPF", "QT_PES_PagadorPJ")
    df = converter_uf(df, "Estado_Ibge")
    df = converter_uf_para_regiao(df, "uf")
    return df


def padronizar_df_scr(df: pd.DataFrame) -> pd.DataFrame:
    df = df.rename(columns={"data_base": "ano_mes", "porte": "classe"})
    df["tipo"] = df["cliente"].map({"PF": "pf"}).fillna("pj")
    df = df.melt(
        id_vars=["ano_mes", "regiao", "uf", "tipo", "classe"],
        value_vars=["carteira_inadimplencia", "carteira_vencida",
                    "carteira_ativa", "vencido_acima_de_90_dias"],
        var_name="metrica", value_name="valor"
    )
    df["origem"] = "scr"
    df = df.groupby(["ano_mes", "regiao", "uf", "tipo", "classe", "metrica", "origem"],
                    observed=True)["valor"].sum().reset_index()
    return df[["ano_mes", "regiao", "uf", "tipo", "classe", "metrica", "origem", "valor"]]


def padronizar_df_pix(df: pd.DataFrame) -> pd.DataFrame:
    df = df.rename(columns={"AnoMes": "ano_mes"})
    df = df.melt(
        id_vars=["ano_mes", "regiao", "uf"],
        value_vars=["VL_PagadorPF", "QT_PagadorPF", "VL_PagadorPJ",
                    "QT_PagadorPJ", "QT_PES_PagadorPF", "QT_PES_PagadorPJ"],
        var_name="metrica_raw", value_name="valor"
    )
    df["tipo"] = df["metrica_raw"].str.endswith("PF").map({True: "pf", False: "pj"})
    df["metrica"] = np.select(
        [df["metrica_raw"].str.contains("VL"),
         df["metrica_raw"].str.contains("QT_PES"),
         df["metrica_raw"].str.contains("QT")],
        ["vl_pagador", "qt_pes_pagador", "qt_pagador"],
        default="outros"
    )
    df["origem"] = "pix"
    df = df.groupby(["ano_mes", "regiao", "uf", "tipo", "metrica", "origem"],
                    observed=True)["valor"].sum().reset_index()
    df["classe"] = None
    return df[["ano_mes", "regiao", "uf", "tipo", "classe", "metrica", "origem", "valor"]]


def processar_ano_scr(args):
    ano, meses_faltantes = args
    url = f"https://www.bcb.gov.br/pda/desig/scrdata_{ano}.zip"
    print(f"Baixando SCR {ano}...")
    r = baixar_com_retry(url, 60)
    dfs = []
    with zipfile.ZipFile(io.BytesIO(r.content)) as zf:
        csvs = [n for n in zf.namelist() if n.endswith(".csv")]
        for csv in csvs:
            with zf.open(csv) as f:
                for chunk in pd.read_csv(f, sep=";", encoding="utf-8-sig",
                                         on_bad_lines="skip", usecols=USECOLS_SCR,
                                         chunksize=CHUNK_SIZE):
                    chunk = tratamento_scr(chunk)
                    chunk = chunk[chunk["data_base"].isin(meses_faltantes)]
                    if not chunk.empty:
                        dfs.append(padronizar_df_scr(chunk))
    if not dfs:
        print(f"SCR {ano}: nenhum mês novo.")
        return pd.DataFrame()
    df = pd.concat(dfs, ignore_index=True)
    df = df.groupby(["ano_mes", "regiao", "uf", "tipo", "classe", "metrica", "origem"],
                    observed=True)["valor"].sum().reset_index()
    print(f"SCR {ano}: {len(df)} linhas novas.")
    return df


def processar_mes_pix(ano_mes: str):
    url = (
        f"https://olinda.bcb.gov.br/olinda/servico/Pix_DadosAbertos/versao/v1/odata/"
        f"TransacoesPixPorMunicipio(DataBase=@DataBase)?@DataBase='{ano_mes}'"
        f"&$top=35000&$format=json"
        f"&$select=AnoMes,Estado_Ibge,VL_PagadorPF,QT_PagadorPF,"
        f"VL_PagadorPJ,QT_PagadorPJ,QT_PES_PagadorPF,QT_PES_PagadorPJ"
    )
    try:
        r = baixar_com_retry(url, 15)
        df = pd.DataFrame(r.json().get("value", []))
        if df.empty:
            return pd.DataFrame()
        df = tratamento_pix(df)
        return padronizar_df_pix(df)
    except Exception as e:
        print(f"PIX {ano_mes}: erro — {e}")
        return pd.DataFrame()


def ler_scr(meses_scr_existentes: set) -> tuple[pd.DataFrame, list]:
    todos_meses = set(gerar_todos_meses("2021-01-01"))
    meses_faltantes = todos_meses - meses_scr_existentes

    if not meses_faltantes:
        print("SCR: nenhum mês novo.")
        return pd.DataFrame(), []

    anos_faltantes = sorted({m[:4] for m in meses_faltantes})
    args = [(int(ano), {m for m in meses_faltantes if m.startswith(ano)}) for ano in anos_faltantes]

    with ThreadPoolExecutor(max_workers=3) as executor:
        resultados = list(executor.map(processar_ano_scr, args))

    dfs = [df for df in resultados if not df.empty]
    if not dfs:
        return pd.DataFrame(), []

    df_final = pd.concat(dfs, ignore_index=True)
    df_final = df_final.groupby(["ano_mes", "regiao", "uf", "tipo", "classe", "metrica", "origem"],
                                 observed=True)["valor"].sum().reset_index()
    meses_novos = df_final["ano_mes"].unique().tolist()
    print(f"SCR total: {len(df_final)} linhas novas em {len(meses_novos)} meses.")
    return df_final, meses_novos


def ler_pix(meses_pix_existentes: set) -> tuple[pd.DataFrame, list]:
    todos_meses = gerar_todos_meses("2021-01-01")
    meses_faltantes = [m for m in todos_meses if m not in meses_pix_existentes]

    if not meses_faltantes:
        print("PIX: nenhum mês novo.")
        return pd.DataFrame(), []

    print(f"PIX: baixando {len(meses_faltantes)} meses...")

    with ThreadPoolExecutor(max_workers=5) as executor:
        resultados = list(executor.map(processar_mes_pix, meses_faltantes))

    dfs = [df for df in resultados if not df.empty]
    if not dfs:
        print("PIX: nenhum dado encontrado.")
        return pd.DataFrame(), []

    df = pd.concat(dfs, ignore_index=True)
    df = df.groupby(["ano_mes", "regiao", "uf", "tipo", "metrica", "origem"],
                    observed=True)["valor"].sum().reset_index()
    df["classe"] = None
    meses_novos = df["ano_mes"].unique().tolist()
    print(f"PIX total: {len(df)} linhas novas em {len(meses_novos)} meses.")
    return df, meses_novos


def ler_ibge(anos_existentes: set) -> pd.DataFrame:
    def ler_json_ibge(url, use_cols, timeout=10):
        r = baixar_com_retry(url, timeout)
        data = r.json()
        df = pd.DataFrame(data)[use_cols].iloc[1:].reset_index(drop=True)
        return df

    print("Baixando IBGE...")

    df_esc = ler_json_ibge(LINKS_IBGE["taxa_escolarizacao"]["url"],
                            LINKS_IBGE["taxa_escolarizacao"]["use_cols"])
    df_esc = limpar_nulos(df_esc)
    df_esc = limpeza_string(df_esc, ["D1N", "D3N"])
    df_esc = converter_uf(df_esc, "D1N")
    df_esc = converter_uf_para_regiao(df_esc, "uf")
    df_esc = converter_porcentagem(df_esc, "V")
    df_esc = df_esc.rename(columns={"D3N": "ano", "V": "taxa_escolarizacao"})
    df_esc = df_esc.groupby(["ano", "regiao", "uf"], observed=True)["taxa_escolarizacao"].mean().reset_index()

    df_censo = ler_json_ibge(LINKS_IBGE["censo_demografico"]["url"],
                              LINKS_IBGE["censo_demografico"]["use_cols"])
    df_censo = limpar_nulos(df_censo)
    df_censo["V"] = df_censo["V"].astype(str).str.replace(".", "", regex=False).str.replace(",", ".", regex=False)
    df_censo = converter_numerico(df_censo, "V")
    df_censo = limpeza_string(df_censo, ["D1N", "D3N"])
    df_censo = converter_uf(df_censo, "D1N")
    df_censo = converter_uf_para_regiao(df_censo, "uf")
    df_censo = df_censo.rename(columns={"D3N": "ano", "V": "valor"})
    df_censo = df_censo.pivot_table(index=["ano", "regiao", "uf"], columns="D2N",
                                     values="valor").reset_index()
    df_censo.columns.name = None
    df_censo = df_censo.rename(columns={
        "População residente": "populacao_residente",
        "Taxa de crescimento geométrico": "taxa_crescimento",
        "Variação absoluta da população residente 2010 compatibilizada": "variacao_populacao",
    })
    df_censo["taxa_crescimento"] = df_censo["taxa_crescimento"] / 100

    df_idade = ler_json_ibge(LINKS_IBGE["populacao_por_idade"]["url"],
                              LINKS_IBGE["populacao_por_idade"]["use_cols"])
    df_idade = limpar_nulos(df_idade)
    df_idade = limpeza_string(df_idade, ["D1N", "D3N", "D5N"])
    df_idade = converter_numerico(df_idade, "V")
    df_idade = converter_uf(df_idade, "D1N")
    df_idade = converter_uf_para_regiao(df_idade, "uf")
    df_idade = df_idade.rename(columns={"D3N": "ano", "V": "valor", "D5N": "idade"})
    df_idade["idade"] = df_idade["idade"].map(MAP_IDADE_MEDIA)
    df_idade["idade_ponderada"] = df_idade["idade"] * df_idade["valor"]
    df_idade = df_idade.groupby(["ano", "regiao", "uf"]).agg(
        soma_idade=("idade_ponderada", "sum"), soma_pop=("valor", "sum")
    ).reset_index()
    df_idade["idade_media"] = df_idade["soma_idade"] / df_idade["soma_pop"]
    df_idade["idade_max"] = df_idade.groupby("ano")["idade_media"].transform("max")
    df_idade["bonusDemografico"] = df_idade["idade_max"] - df_idade["idade_media"]
    df_idade = df_idade[["ano", "regiao", "uf", "bonusDemografico"]]

    df_ibge = df_esc.merge(df_censo, on=["ano", "regiao", "uf"], how="left")
    df_ibge = df_ibge.merge(df_idade, on=["ano", "regiao", "uf"], how="left")
    df_ibge = df_ibge.sort_values(["uf", "regiao", "ano"]).ffill().reset_index(drop=True)
    df_ibge["ano"] = df_ibge["ano"].astype(str)

    df_novo = df_ibge[~df_ibge["ano"].isin(anos_existentes)]
    print(f"IBGE: {len(df_novo)} linhas novas.")
    return df_novo


def agrupar_metrica(df, metrica, filtro_extra=None):
    mask = df["metrica"] == metrica
    if filtro_extra is not None:
        mask &= filtro_extra
    return df[mask].groupby(filtro)["valor"].sum()


def calcular_eixo_i(df_scr_pix: pd.DataFrame, df_ibge: pd.DataFrame) -> pd.DataFrame:
    df = df_scr_pix.copy()
    df["ano"] = df["ano_mes"].astype(str).str[:4]

    df_calc = df.merge(
        df_ibge[["ano", "regiao", "uf", "taxa_escolarizacao"]],
        on=["ano", "regiao", "uf"], how="inner"
    ).drop(columns=["ano"])

    df_calc["taxa_escolarizacao"] = df_calc.groupby("uf")["taxa_escolarizacao"].transform(
        lambda x: x.ffill().bfill()
    )

    df_metricas = pd.concat([
        agrupar_metrica(df_calc, "carteira_vencida").rename("carteira_vencida"),
        agrupar_metrica(df_calc, "carteira_ativa").rename("carteira_ativa"),
        agrupar_metrica(df_calc, "carteira_ativa", df_calc["classe"].isin(["D", "E"])).rename("carteira_ativa_de"),
        agrupar_metrica(df_calc, "vencido_acima_de_90_dias").rename("vencido_acima_de_90_dias"),
    ], axis=1).reset_index()

    df_calc = (
        df_calc[["ano_mes", "regiao", "uf", "taxa_escolarizacao"]].drop_duplicates()
        .merge(df_metricas, on=filtro, how="left")
    )

    df_calc["inadimplenciaReal"] = df_calc["carteira_vencida"] / df_calc["carteira_ativa"]
    df_calc["fragilidadeRenda"] = df_calc["carteira_ativa_de"] / df_calc["carteira_ativa"]
    df_calc["agingDivida"] = df_calc["vencido_acima_de_90_dias"] / df_calc["carteira_vencida"]
    df_calc["vulnerabilidadeSocial"] = 1 - df_calc["taxa_escolarizacao"]

    for col in ["inadimplenciaReal", "fragilidadeRenda", "agingDivida", "vulnerabilidadeSocial"]:
        df_calc = normalizacao(df_calc, col)

    return df_calc[["ano_mes", "regiao", "uf", "inadimplenciaReal",
                     "fragilidadeRenda", "agingDivida", "vulnerabilidadeSocial"]]


def calcular_eixo_ii(df_scr_pix: pd.DataFrame, df_ibge: pd.DataFrame) -> pd.DataFrame:
    df = df_scr_pix.copy()
    df["ano"] = df["ano_mes"].astype(str).str[:4]

    df_calc = df.merge(
        df_ibge[["ano", "regiao", "uf", "populacao_residente", "taxa_crescimento",
                 "variacao_populacao", "bonusDemografico"]],
        on=["ano", "regiao", "uf"], how="left"
    ).drop(columns=["ano"])

    for col in ["populacao_residente", "taxa_crescimento", "variacao_populacao", "bonusDemografico"]:
        df_calc[col] = df_calc.groupby("uf")[col].transform(lambda x: x.ffill().bfill())

    df_metricas = pd.concat([
        agrupar_metrica(df_calc, "vl_pagador").rename("vl_pagador"),
        agrupar_metrica(df_calc, "qt_pes_pagador").rename("qt_pes_pagador"),
        agrupar_metrica(df_calc, "qt_pagador").rename("qt_pagador"),
    ], axis=1).reset_index()

    df_calc = (
        df_calc[["ano_mes", "regiao", "uf", "populacao_residente", "taxa_crescimento",
                 "variacao_populacao", "bonusDemografico"]].drop_duplicates()
        .merge(df_metricas, on=filtro, how="left")
    )

    df_calc["maturidadePix"] = (
        (df_calc["qt_pagador"] / df_calc["qt_pes_pagador"]) * 0.6 +
        (df_calc["vl_pagador"] / df_calc["qt_pes_pagador"]) * 0.4
    )
    df_calc["crescimentoPopulacional"] = df_calc["taxa_crescimento"]
    df_calc["totalHabitantes"] = df_calc["populacao_residente"]

    for col in ["maturidadePix", "crescimentoPopulacional", "totalHabitantes", "bonusDemografico"]:
        df_calc = normalizacao(df_calc, col)

    return df_calc[["ano_mes", "regiao", "uf", "maturidadePix",
                     "crescimentoPopulacional", "totalHabitantes", "bonusDemografico"]]


def salvar_no_banco(df: pd.DataFrame, tabela: str, con: sqlite3.Connection):
    if df.empty:
        return
    df.to_sql(tabela, con, if_exists="append", index=False)
    print(f"Salvo {len(df)} linhas em {tabela}.")


@app.post("/processar")
def processar():
    try:
        con = get_db()

        meses_scr = meses_existentes_por_origem("scr")
        meses_pix = meses_existentes_por_origem("pix")
        anos_ibge = meses_existentes_db("EstruturaIBGE", "ano")
        meses_risco = meses_existentes_db("RiscoCredito", "mesAno")
        meses_inclusao = meses_existentes_db("inclusaoExpansao", "mesAno")

        df_scr, meses_novos_scr = ler_scr(meses_scr)
        df_pix, meses_novos_pix = ler_pix(meses_pix)
        df_ibge_novo = ler_ibge(anos_ibge)

        df_ibge_existente = pd.read_sql('SELECT * FROM "EstruturaIBGE"', con)
        df_ibge_completo = pd.concat([df_ibge_existente, df_ibge_novo], ignore_index=True) \
            if not df_ibge_novo.empty else df_ibge_existente

        dfs_novos = [d for d in [df_scr, df_pix] if not d.empty]
        if not dfs_novos:
            print("Nenhum dado SCR/PIX novo.")
            salvar_no_banco(df_ibge_novo, "EstruturaIBGE", con)
            con.commit()
            con.close()
            return JSONResponse({"status": "ok", "mensagem": "Nenhum dado novo."})

        df_scr_pix_novo = pd.concat(dfs_novos, ignore_index=True)

        meses_afetados_scr = meses_novos_scr
        meses_afetados_pix = meses_novos_pix
        meses_afetados = list(set(meses_afetados_scr + meses_afetados_pix))

        deletar_meses("EstruturaSrcPix", "ano_mes", meses_afetados_scr, con, origem="scr")
        deletar_meses("EstruturaSrcPix", "ano_mes", meses_afetados_pix, con, origem="pix")
        deletar_meses("RiscoCredito", "mesAno", meses_afetados, con)
        deletar_meses("inclusaoExpansao", "mesAno", meses_afetados, con)

        df_scr_pix_existente = pd.read_sql('SELECT * FROM "EstruturaSrcPix"', con)
        df_scr_pix_completo = pd.concat([df_scr_pix_existente, df_scr_pix_novo], ignore_index=True)

        df_eixo_i_completo = calcular_eixo_i(df_scr_pix_completo, df_ibge_completo)
        df_eixo_ii_completo = calcular_eixo_ii(df_scr_pix_completo, df_ibge_completo)

        df_eixo_i_salvar = df_eixo_i_completo[df_eixo_i_completo["ano_mes"].isin(meses_afetados)].rename(
            columns={"ano_mes": "mesAno", "inadimplenciaReal": "inadiplenciaReal"})
        df_eixo_ii_salvar = df_eixo_ii_completo[df_eixo_ii_completo["ano_mes"].isin(meses_afetados)].rename(
            columns={"ano_mes": "mesAno", "totalHabitantes": "populacaoAbsoluta"})

        df_ibge_para_salvar = df_ibge_novo.drop(columns=["bonusDemografico"], errors="ignore")

        salvar_no_banco(df_scr_pix_novo, "EstruturaSrcPix", con)
        salvar_no_banco(df_ibge_para_salvar, "EstruturaIBGE", con)
        salvar_no_banco(df_eixo_i_salvar, "RiscoCredito", con)
        salvar_no_banco(df_eixo_ii_salvar, "inclusaoExpansao", con)

        con.commit()
        con.close()

        return JSONResponse({"status": "ok", "mensagem": "Processamento concluído com sucesso."})

    except Exception as e:
        import traceback
        msg = traceback.format_exc()
        print(msg)
        raise HTTPException(status_code=500, detail=msg)


@app.get("/health")
def health():
    return {"status": "ok"}