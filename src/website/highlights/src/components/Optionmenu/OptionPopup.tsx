import React, { useState, useRef } from "react";
import { Menu, Button } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import Swal from "sweetalert2";

interface SubMenuProps {
  opened: boolean;
  onClose: () => void;
}

const SubMenu: React.FC<SubMenuProps> = ({ opened, onClose }) => (
  <Menu opened={opened} onClose={onClose}>
    <Menu.Target>
      <div />
    </Menu.Target>
    <Menu.Dropdown>
      <Menu.Item onClick={onClose}>Start Pomodoro</Menu.Item>
      <Menu.Item onClick={onClose}>Start Stopwatch</Menu.Item>
    </Menu.Dropdown>
  </Menu>
);

interface OptionsMenuProps {
  onUpdateClick: () => void;
  onDelete: () => void;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  // onOpenPopup,
  onUpdateClick,
  onDelete,
}) => {
  const [opened, setOpened] = useState(false);
  const [submenuOpened, setSubmenuOpened] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClose = (action?: string) => {
    setOpened(false);
    setSubmenuOpened(false);
    if (action === "delete") {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          onDelete();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });
    }
  };

  return (
    <Menu shadow="md" width={200} opened={opened} onClose={() => handleClose()}>
      <Menu.Target>
        <Button
          color="rgb(253, 253, 253)"
          // margin-right= "(-500%)"

          onClick={() => setOpened((o) => !o)}
          ref={buttonRef}
        >
          <IconDotsVertical stroke={2} style={{ color: "black" }} />
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          onClick={() => {
            handleClose();
            onUpdateClick();
          }}
        >
          Update
        </Menu.Item>
        {/* <Menu.Item
          onClick={() => {
            handleClose();
            onOpenPopup();
          }}
        >
          Add Subtask
        </Menu.Item> */}
        <Menu.Item color="red" onClick={() => handleClose("delete")}>
          Delete
        </Menu.Item>
        <Menu.Item
          onMouseEnter={() => setSubmenuOpened(true)}
          onMouseLeave={() => setSubmenuOpened(false)}
        >
          Focus
          {submenuOpened && (
            <SubMenu
              opened={submenuOpened}
              onClose={() => setSubmenuOpened(false)}
            />
          )}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default OptionsMenu;
