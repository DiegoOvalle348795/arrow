import MobileHeader from "./MobileHeader";

export default function LayoutAdminPrivate({ children }) {
  return (
    <div className="p-4">
      <MobileHeader />
      {children}
    </div>
  );
}
