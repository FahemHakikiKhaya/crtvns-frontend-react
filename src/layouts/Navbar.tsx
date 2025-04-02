import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useAuth } from "@/provider/AuthProvider";
import { useNavigate } from "react-router";

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  return (
    <Menubar className="flex-row justify-end">
      <MenubarMenu>
        <MenubarTrigger>Menu</MenubarTrigger>
        <MenubarContent>
          {auth.token ? (
            <MenubarItem onClick={() => navigate("/")}>Home</MenubarItem>
          ) : (
            <MenubarItem onClick={() => navigate("/login")}>Login</MenubarItem>
          )}
          <MenubarItem onClick={() => navigate("/history")}>
            History
          </MenubarItem>
          {auth.token && (
            <MenubarItem onClick={() => auth.logout()}>Log out</MenubarItem>
          )}{" "}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default Navbar;
