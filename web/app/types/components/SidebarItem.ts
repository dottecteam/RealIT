export default interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    isOpen: boolean;
    href: string;
    active?: boolean;
}