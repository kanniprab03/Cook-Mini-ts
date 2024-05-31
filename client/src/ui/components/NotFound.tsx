import { IconButton } from "@mui/joy";
import { useView } from "../../lib/context/ViewContext";
import { IconHome } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const { setHeader } = useView();
  const navigate = useNavigate();
  setHeader(false);
  return (
    <div className="flex items-center bg-black w-screen h-screen justify-center flex-col">
      <h1 className="text-white text-[80px] font-bold">404</h1>
      <p>
        <IconButton onClick={() => navigate("/")} variant="soft">
          <IconHome />
        </IconButton>
      </p>
    </div>
  );
}
