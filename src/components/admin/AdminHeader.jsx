import React from "react";
import { TabMenu } from "primereact/tabmenu";
import { useNavigate, useLocation } from "react-router-dom";
import CurrentDateTime from "../CurrentDateTime";
import SettingsMenu from "../SettingsMenu";
import "../../styles/Page.css"

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    {
      label: "Users",
      path: "/admin/users",
      command: function () {
        navigate(this.path);
      }
    },
    {
      label: "Products",
      path:"/admin/products",
      command: function () {
        navigate(this.path);
      }
    }
  ];

  // set the active index according to the current path
  const [activeIndex, setActiveIndex] = React.useState(items.indexOf(items.find((i) => i.path === location.pathname)));

  return (
    <div className="header-container">
      <div className="tab-items">
        <div className="tab-item1">
          <TabMenu className="p-responsive" model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
        </div>
        <div className="tab-item2">
          <CurrentDateTime />
        </div>
        <div className="tab-item3">
          <SettingsMenu />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;