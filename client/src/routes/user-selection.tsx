import { FormEvent } from "react";
import { User } from "../types";
import Select from "../components/ui/Select";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppProvider";
import Button from "../components/ui/Button";

function UserSelection() {
  const { users, selectedUser, handleUserSelection } = useAppContext();

  const navigate = useNavigate();

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (selectedUser.token === "") {
      alert("Please select a valid user");
      return;
    }

    navigate("/excels");
  };

  const handleChangeUser = (u: User) => {
    handleUserSelection(u);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col items-center justify-center h-full gap-7"
    >
      <div className="w-[250px]">
        <Select
          options={users}
          value={selectedUser}
          onChange={handleChangeUser}
          renderOption={(option) => option.name}
          getOptionValue={(option) => option.name}
          labelValue="Select a user:"
        />
      </div>
      <Button className="px-3 py-2 text-lg bg-blue-500 text-white rounded-md">
        Select
      </Button>
    </form>
  );
}

export default UserSelection;
