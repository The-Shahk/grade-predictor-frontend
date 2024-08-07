import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, HashRouter} from "react-router-dom";
import Layout from "./pages/Layout";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Calculate from "./pages/Calculate";
import Register from "./pages/Register";


export default function App() {
  return (
    <HashRouter basename={"/grade-predictor-frontend"}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="account" element={<Account />} />
          <Route path="login" element={<Login />} />
          <Route path="calculate" element={<Calculate/> } />
          <Route path="register" element={<Register/> } />
        </Route>
      </Routes>
    </HashRouter>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));


