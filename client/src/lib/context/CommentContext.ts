import { createContext, useContext } from "react";

export interface ICommentType { comment: string; userId: string; userName?: string; profileImg?: string; isHelpful: { _id: string; helpful: boolean }; }[];
export interface IInsertPayload { comment: string; }
export interface IInsertResponse { message: string; status: boolean; }
export interface IInsertTipPayload { isHelpful: { tip?: string; helpful: boolean }; }
export interface IComment {
  globalComment: ICommentType[];
  insertComment: (
    id: string,
    payload: IInsertPayload
  ) => Promise<IInsertResponse>;
  insertCommentTip: () => Promise<unknown>;
  getComments: (id: string) => Promise<IInsertResponse>;
  setGlobalComment: React.Dispatch<
    React.SetStateAction<ICommentType[] | undefined>
  >;
}

export const CommentContext = createContext<IComment | undefined>(undefined);

export const useComment = () => {
  const context = useContext(CommentContext);
  if (!context)
    throw new Error(
      "CommentContext must be used inside a CommentContext instance"
    );
  return context;
};
