import React, { useState, useRef } from "react";
import { Menu, Button } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import Swal from "sweetalert2";





interface CompleteMenuProps {
  onUpdateClick: () => void;
  onDelete: () => void;
}

const CompleteMenu: React.FC<CompleteMenuProps> = ({
  
  onUpdateClick,
  onDelete,
}) => {
  const [opened, setOpened] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClose = (action?: string) => {
    setOpened(false);
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
          Reschedule
        </Menu.Item>
        
        <Menu.Item color="red" onClick={() => handleClose("delete")}>
          Delete
        </Menu.Item>
        
        
      </Menu.Dropdown>
    </Menu>
  );
};

export default CompleteMenu;
