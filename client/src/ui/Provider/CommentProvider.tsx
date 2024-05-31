import axios from "axios";
import { useState } from "react";
import {
  CommentContext,
  IComment,
  ICommentType,
  IInsertPayload,
  IInsertResponse,
} from "../../lib/context/CommentContext";
import { CommonResponse } from "../../lib/context/types/Context";

export default function CommentProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [comments, setComments] = useState<ICommentType[]>();

  const insertComment = (
    id: string,
    payload: IInsertPayload
  ): Promise<IInsertResponse> => {
    return new Promise<IInsertResponse>((resolve) => {
      commentInstance
        .post("/insert/" + id, payload)
        .then((res) => {
          if (res.data.status) {
            setComments(res.data.comments);
          } else {
            setComments([]);
          }
          resolve({
            message: res.data.message,
            status: res.data.status,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
          });
        });
    });
  };
  const insertCommentTip = (): Promise<CommonResponse> => {
    return new Promise(() => {});
  };

  const getComments = (id: string): Promise<IInsertResponse> => {
    return new Promise<IInsertResponse>((resolve) => {
      if (id)
        commentInstance
          .get("/get/" + id)
          .then((res) => {
            if (res.data.status) {
              setComments(res.data.comments);
            } else setComments([]);
            resolve({
              message: res.data.message,
              status: res.data.status,
            });
          })
          .catch((err) => {
            resolve({
              message: err.message,
              status: false,
            });
          });
    });
  };

  const value: IComment = {
    globalComment: comments!,
    getComments,
    insertComment,
    insertCommentTip,
    setGlobalComment: setComments,
  };

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
}

const commentInstance = axios.create({
  headers: {
    "auth-token": localStorage.getItem("token"),
  },
  baseURL: "http://localhost:5500/api/comment",
});
