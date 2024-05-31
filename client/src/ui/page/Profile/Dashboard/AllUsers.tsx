/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chip, CircularProgress, Option, Select } from "@mui/joy";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../lib/context/AuthContext";
import { USER_ROLES } from "../../../../lib/context/types/AuthTypes";
import { User } from "../../../../lib/context/types/Context";
import { useNavigate } from "react-router-dom";

export default function AllUsers() {
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchAllPendingRecipes = () => {
    setLoading(true);
    axios
      .get("http://localhost:5500/api/user/all", {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setLoading(false);
        setUsers(res.data.users);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchAllPendingRecipes();
  }, []);

  const { isAuthenticated, User } = useAuth();

  const navigate = useNavigate()

  if (!isAuthenticated || User?.role !== USER_ROLES.ADMIN) {
    navigate("/404");
  }

  return (
    <div className="p-3 flex flex-1">
      <table className="table-auto text-center rounded-md overflow-hidden border-2 border-black border-collapse w-full">
        <thead className="bg-black text-white">
          <tr>
            <th>Sl No</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={10} className="p-2">
                <CircularProgress />
              </td>
            </tr>
          ) : (
            users.map((user, i) => (
              <React.Fragment key={i}>
                <Row user={user} i={i} />
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const Row = ({ user, i }: { user: User; i: number }) => {
  const [role, setRole] = useState<USER_ROLES>(user?.role);
  const [loading, setLoading] = useState(false);
  const { updateRole } = useAuth();

  const Img = (
    <img
      src={`http://localhost:5500/api/user/bucket/${user?.profileImg}`}
      alt={user?.name}
    />
  );

  const handleUpdate = async (e: USER_ROLES) => {
    setLoading(true);
    const res = await updateRole({ role: e, _id: user?._id! });
    if (res.status) {
      setRole(e);
    } else alert(res.message);
    setLoading(false);
  };

  return (
    <>
      <tr key={i} className="border-t-2">
        <td>{i + 1}</td>
        <td className="w-10">{Img}</td>
        <td>{user?.name}</td>
        <td>{user?.email}</td>
        <td>
          {role === "user" ? (
            <Chip color="neutral">User</Chip>
          ) : role === USER_ROLES.ADMIN ? (
            <Chip color="warning">Admin</Chip>
          ) : role === USER_ROLES.CREATOR ? (
            <Chip color="success">Creator</Chip>
          ) : (
            <></>
          )}
        </td>
        <td>
          {!loading ? (
            <Select
              onChange={(_e, v) => handleUpdate(v!)}
              variant="plain"
              defaultValue={role}
            >
              <Option value={USER_ROLES.USER}>{USER_ROLES.USER}</Option>
              <Option value={USER_ROLES.CREATOR}>{USER_ROLES.CREATOR}</Option>
              <Option value={USER_ROLES.ADMIN}>{USER_ROLES.ADMIN}</Option>
            </Select>
          ) : (
            <section className="">
              <CircularProgress size="sm" />
            </section>
          )}
        </td>
      </tr>
    </>
  );
};
