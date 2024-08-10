import { FormEvent } from "react";
import { User } from "../types";
import Select from "../components/ui/Select";
import { users } from "../mocks";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppProvider";

function UserSelection() {
  const { user, handleUserSelection } = useAppContext();

  const navigate = useNavigate();

  const handleFormSubmit = async (e: FormEvent) => {
    // API Call
    e.preventDefault();

    if (user.email === "") {
      alert("Please select a valid user");
      return;
    }

    navigate("/excels");

    console.log(user);
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
          value={user}
          onChange={handleChangeUser}
          renderOption={(option) => option.name}
          getOptionValue={(option) => option.name}
          labelValue="Select a user:"
        />
      </div>
      <button className="px-3 py-2 text-lg bg-blue-500 text-white rounded-md">
        Select
      </button>
    </form>
  );
}

export default UserSelection;
