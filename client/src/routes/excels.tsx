import { useAppContext } from "../context/useAppProvider";

function Excels() {
  const { user } = useAppContext();

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Excels page</p>
    </div>
  );
}

export default Excels;
