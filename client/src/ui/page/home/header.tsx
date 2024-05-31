/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClickAwayListener, Popper } from "@mui/base";
import {
  Avatar,
  Button,
  IconButton,
  MenuItem,
  MenuList,
  styled
} from "@mui/joy";
import {
  IconApiApp,
  IconBookmark,
  IconChefHat,
  IconEggCracked,
  IconLogout,
  IconMenu2,
  IconPlus,
  IconSearch,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../lib/context/AuthContext";
import { useView } from "../../../lib/context/ViewContext";
import { USER_ROLES } from "../../../lib/context/types/AuthTypes";

const hoverSxIcon = {
  ":hover": {
    backgroundColor: "#FB8C00",
    color: "white",
  },
};

export default function Header() {
  const { header } = useView();

  const { isAuthenticated } = useAuth();

  if (!header) {
    return <></>;
  }

  return (
    <div className="flex justify-between p-2 shadow-sm w-full">
      <div className="flex flex-row md:justify-center items-center space-x-3 md:pl-3 w-screen">
        <div className="flex flex-1 md:flex-none md:space-x-2">
          <IconChefHat color="#FB8C00" className="" />
          <Link to="/">
            <h1 className="text-xl font-semibold text-orange-500">COOK MINi</h1>
          </Link>
        </div>
        <Navs />
        {isAuthenticated ? <User /> : <Guest />}
      </div>
      <MobileMenu />
    </div>
  );
}

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="md:hidden absolute bottom-3 right-2">
      {!isOpen ? (
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          variant="soft"
          color="primary"
        >
          <IconMenu2 />
        </IconButton>
      ) : (
        <div className="border rounded-md p-3 gap-2 flex flex-col">
          <IconButton sx={hoverSxIcon} variant="soft">
            <IconEggCracked />
            Recipes
          </IconButton>
          <IconButton
            onClick={() => navigate("/explore")}
            sx={hoverSxIcon}
            variant="soft"
          >
            <IconApiApp />
            Explore
          </IconButton>
          <IconButton
            onClick={() => navigate("/search")}
            sx={hoverSxIcon}
            variant="soft"
          >
            <IconSearch />
            Search
          </IconButton>
          <IconButton
            onClick={() => navigate("/profile/recipes/create")}
            sx={hoverSxIcon}
            variant="soft"
          >
            <IconPlus />
            Create
          </IconButton>
          <IconButton onClick={() => setIsOpen(!isOpen)} size="sm">
            <IconX className="w-full " />
          </IconButton>
        </div>
      )}
    </div>
  );
};

const Navs = () => {
  return (
    <div className="hidden md:flex-1 md:flex justify-end gap-4 items-center pr-2">
      {/* <Link to="/" className="font-medium text-sm">
        Recipes
      </Link> */}
      <Link to="/explore" hidden className="font-medium text-sm">
        Explore
      </Link>
      <Link
        to="/search"
        className="font-medium gap-1 text-sm flex items-center"
      >
        {/* <IconSearch size={15} /> */}
        Search
      </Link>
      {/* <Tooltip title="Not Available Right Now" color="primary">
        <Link to="?" className="font-medium text-sm text-gray-400">
          Premium
        </Link>
      </Tooltip> */}
    </div>
  );
};

const Guest = () => {
  return (
    <div className="">
      <Link to="/auth/login">
        <Button
          sx={{
            backgroundColor: "#FB8C00",
            ":hover": {
              backgroundColor: "#ffa500",
            },
          }}
          size="sm"
          type="submit"
        >
          Sign in
        </Button>
      </Link>
    </div>
  );
};

const User = () => {
  const { UserRole, User, UserLogout } = useAuth();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleListKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Tab") {
      setOpen(false);
    } else if (event.key === "Escape") {
      buttonRef.current!.focus();
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Popup = styled(Popper)({
    zIndex: 1000,
  });

  return (
    <div className="flex items-center gap-4 pr-3">
      <section className="md:hidden">
        <IconButton sx={hoverSxIcon} variant="soft" size="sm">
          <IconBookmark className="w-[20px]" />
        </IconButton>
      </section>
      <Link to="/profile" className="hidden md:block font-medium text-sm">
        Saved
      </Link>
      <Link to="/profile" className="hidden md:block font-medium text-sm">
        {User?.profileImg ? (
          <Avatar
            size="sm"
            src={`http://localhost:5500/api/user/bucket/${User?.profileImg}`}
          ></Avatar>
        ) : (
          <IconButton sx={hoverSxIcon} variant="soft" size="sm">
            <IconUserCircle className="w-[20px]" />
          </IconButton>
        )}
      </Link>
      {UserRole == USER_ROLES.CREATOR && (
        <section className="hidden md:block">
          <Link to="/profile/recipes/create">
            <Button size="sm">Create</Button>
          </Link>
        </section>
      )}
      {UserRole == USER_ROLES.ADMIN && (
        <section className="hidden md:block">
          <Button
            size="sm"
            id="composition-button"
            aria-controls={"composition-menu"}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={() => {
              setOpen(!open);
            }}
            ref={buttonRef}
          >
            Dashboard
          </Button>
          <Popup
            role={undefined}
            id="composition-menu"
            open={open}
            anchorEl={buttonRef.current}
            disablePortal
            modifiers={[
              {
                name: "offset",
                options: {
                  offset: [0, 4],
                },
              },
            ]}
          >
            <ClickAwayListener
              onClickAway={(event) => {
                if (event.target !== buttonRef.current) {
                  handleClose();
                }
              }}
            >
              <MenuList
                variant="outlined"
                onKeyDown={handleListKeyDown}
                sx={{ boxShadow: "md" }}
              >
                <Link to="/profile/recipes/dashboard/all">
                  <MenuItem onClick={handleClose}>All Recipes</MenuItem>
                </Link>
                <Link to="/profile/recipes/dashboard/pending">
                  <MenuItem onClick={handleClose}>Pending Recipes</MenuItem>
                </Link>
                <Link to="/profile/recipes/dashboard/user/all">
                  <MenuItem onClick={handleClose}>All Users</MenuItem>
                </Link>

                {/* <Link to="/profile/recipes/dashboard/site">
                  <MenuItem onClick={handleClose}>Site Settings</MenuItem>
                </Link> */}
              </MenuList>
            </ClickAwayListener>
          </Popup>
        </section>
      )}
      <section className="hidden md:block">
        <IconButton onClick={UserLogout} size="sm" color="danger">
          <IconLogout />
        </IconButton>
      </section>
    </div>
  );
};
