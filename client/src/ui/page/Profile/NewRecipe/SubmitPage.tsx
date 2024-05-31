import { Avatar, Button } from "@mui/joy";
import { IconSend2 } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function RecipeSubmitPage() {
  const navigate = useNavigate()
  return (
    <section className="flex flex-col items-center gap-4">
      <Avatar
        variant="solid"
        sx={{ width: 100, height: 100, backgroundColor: "#ff9800" }}
      >
        <IconSend2 size="50px" />
      </Avatar>
      <h1 className="text-xl">Recipe submitted successfully</h1>
      <p className="text-center">
        Your recipe will be reviewed by our team before it is published. You can
        track recipe submission in your dashboard
      </p>
      <Button onClick={() => navigate("/profile")}>Go to Dashboard </Button>
    </section>
  );
}
