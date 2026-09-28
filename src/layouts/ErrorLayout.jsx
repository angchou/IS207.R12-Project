import { Outlet } from "react-router-dom";

export default function ErrorLayout() {
  return (
    <div className="">
      <header></header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
}
