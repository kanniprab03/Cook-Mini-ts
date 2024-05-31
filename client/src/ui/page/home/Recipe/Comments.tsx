/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Button, CircularProgress, Input } from "@mui/joy";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../lib/context/AuthContext";
import { useComment } from "../../../../lib/context/CommentContext";

export default function Comments({ recipe_id, comment_id, is, }: { recipe_id: string; comment_id: string; is: boolean; }) {
  const [isLoading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(true);
  const [value, setValue] = useState("");
  const { insertComment, globalComment, getComments, setGlobalComment } = useComment();
  const { isAuthenticated } = useAuth();

  const handleInsert = async () => {
    if (value !== "") {
      setLoading(true);
      const res = await insertComment(recipe_id, { comment: value });
      if (!res.status) alert(res.message);
      setValue("");
      setLoading(false);
    }
  };

  useEffect(() => {
    getComments(comment_id);
  }, [comment_id]);

  useEffect(() => {
    setGlobalComment(undefined);
  }, []);

  useEffect(() => {
    if (globalComment && globalComment?.length > 0) {
      setCommentLoading(false);
    }
  }, [globalComment]);

  return (
    <section>
      <section className={`mt-2 flex gap-2 ${isAuthenticated && is ? "block" : "hidden"}`} >
        <Input size="sm" value={value} onChange={(e) => setValue(e.target.value)} placeholder="tips" className="flex-1" />
        <Button loading={isLoading} onClick={handleInsert} size="sm"> Submit </Button>
      </section>
      {commentLoading ? (<section className={`${globalComment && globalComment.length > 0 ? "block" : "hidden"} flex items-center justify-center mt-5`} > <CircularProgress /> </section>)
        :
        (<section className="pt-2 space-y-1">
          {globalComment?.map((_y, i) => (
            <section className="border p-2 rounded-md space-y-1" key={i}>
              <section className="flex items-center gap-3">
                <Avatar size="sm" src={`http://localhost:5500/api/user/bucket/${_y?.profileImg}`}></Avatar>
                <section className="flex items-center">
                  <p className="font-medium">{_y?.userName}</p>
                </section>
              </section>
              <p className="text-sm pl-1 mt-1">{_y?.comment}</p>
            </section>
          ))}
        </section>
        )}
    </section>
  );
}
