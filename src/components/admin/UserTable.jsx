import React, { useRef, useState, useContext, useEffect } from "react";
import 'primeicons/primeicons.css';
import useUser from "../../hooks/useUser";
import { createEntity, editEntityById, deleteEntityById } from "../../services/api";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Context } from "../../Context";
import { Column } from "primereact/column";


const UserTable = () => {
    const [currentPage, setCurrentPage] = useState(1); // current page state
    const [pageSize, setPageSize] = useState(10); //page size state
    const { allUsers, refreshUsers } = useUser(currentPage, pageSize);
    const { user: _user } = useContext(Context); // user context
    const toast = useRef(null); // ref for toast messages
    const dt = useRef(null); // ref for the DataTable
    const [user, setUser] = useState({}); // user state to set the user object
    const [submitted, setSubmitted] = useState(false); // submitted state to check if the dialog is submitted
    const [userDialog, setUserDialog] = useState(false); // user dialog state to show or hide create user dialog
    const [deleteUserDialog, setDeleteUserDialog] = useState(false); // delete user dialog state to show or hide delete user dialog
    const [globalFilter, setGlobalFilter] = useState(null); // global filter state for searching

    const openNewDialog = () => {
        // open new user dialog
        setUser({});
        setSubmitted(false);
        setUserDialog(true);
    }

    useEffect(() => {
        refreshUsers();
    }, [pageSize, currentPage]);

    const hideDialog = () => {
        // hide new user dialog when editing or creating new user is done
        setUserDialog(false);
        setSubmitted(false);
    }

    const hideDeleteUserDialog = () => {
        // hide delete user dialog when deleting a user is done
        setDeleteUserDialog(false);
    }

    const saveAsExcelFile = (buffer, fileName) => {
        // save user table as excel file
        import("file-saver").then((module) => {
          if (module && module.default) {
            let EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            let EXCEL_EXTENSION = ".xlsx";
            const data = new Blob([buffer], {
              type: EXCEL_TYPE
            });
    
            module.default.saveAs(data, fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION);
          }
        });
    };

    const exportExcel = () => {
        // export excel file
        import("xlsx").then((xlsx) => {
          const worksheet = xlsx.utils.json_to_sheet(allUsers);
          const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
          const excelBuffer = xlsx.write(workbook, {
            bookType: "xlsx",
            type: "array"
          });
    
          saveAsExcelFile(excelBuffer, "users");
        });
    };

    const saveUser = () => {
        // create user if id not found, otherwise edit user
        if (user.id == null) {
            createEntity("User", user, _user.token).then(() => {
                setSubmitted(true);
                toast.current.show({ severity: "success", summary: "Successfully", detail: "User created", life: 3000 });
                setUserDialog(false);
                refreshUsers();
                setUser({});
            });
        } else {
            editEntityById("User", user.id, user, _user.token).then(() => {
                setSubmitted(true);
                toast.current.show({ severity: "success", summary: "Successfully", detail: "User updated", life: 3000 });
                setUserDialog(false);
                refreshUsers();
                setUser({});
            });
        }
    };

    const editUser = (user) => {
        // open dialog for editing user
        setUser({ ...user });
        setUserDialog(true);
    }

    const deleteUser = () => {
        // delete user if confirmed
        deleteEntityById("User", user.id, _user.token).then(() => {
            setUserDialog(false);
            setUser({});
            toast.current.show({ severity: "success", summary: "Successfully", detail: "User deleted", life: 3000 });
            refreshUsers();
        })
    }

    const confirmDeleteUser = (user) => {
        // confirm if user should be deleted
        setUser(user);
        setDeleteUserDialog(true);
    };

    const onInputChange = (e, name) => {
        // on input change, set property on user object
        const val = (e.target && e.target.value) || e.value || "";
        let _user = { ...user };
        _user[`${name}`] = val;
        setUser(_user);
    };

    const actionBodyTemplate = (rowData) => {
        // action body template for edit and delete buttons
        return (
            <React.Fragment>
                <Button
                    style={{ backgroundColor: "#ffebcd" }}
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success p-mr-2"
                    onClick={() => editUser(rowData)}
                />
                <Button 
                    style={{backgroundColor: "#ffebcd"}}
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => confirmDeleteUser(rowData)}
                />
            </React.Fragment>
        );
    };

    // --------------------------------------------------------------------------------------------------------------------------------------------
    // Templates

    const header = // header template for search bar
        (
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <div className="flex flex-wrap gap-2">
                    <Button label="Create new user" style={{ borderRadius: "10px", backgroundColor: "#ffebcd" }} icon="pi pi-plus" severity="success" onClick={openNewDialog} />
                </div>
                <Button
                    style={{ borderRadius: "10px", backgroundColor: "#ffebcd" }}
                    label="Export"
                    type="button"
                    icon="pi pi-file-excel"
                    severity="success"
                    onClick={exportExcel}
                />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText style={{ borderRadius: "20px" }} type="search" onInput={(e) => setGlobalFilter(e.target.value)} />
                </span>
            </div>
        );

    const userDialogFooter = // user dialog footer template
        (
            <React.Fragment>
                <div className="dialog-row">
                    <Button icon="pi pi-times" className="p-button-outlined" style={{ borderRadius: "10px", color: "black", fontWeight: "bold" }} onClick={hideDialog} />
                    <Button
                        label="Save"
                        className="pi-button-text"
                        style={{ borderRadius: "10px", color: "black", fontWeight: "bold" }}
                        icon="pi pi-check"
                        onClick={saveUser}
                    />
                </div>
            </React.Fragment>
        );

    const deleteUserDialogFooter = // delete user dialog footer template
        (
            <React.Fragment>
                <div className="dialog-row">
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        className="p-button-outlined"
                        style={{ borderRadius: "10px", color: "black", fontWeight: "bold" }}
                        onClick={hideDeleteUserDialog}
                    />
                    <Button
                        label="Delete"
                        className="pi-button-text"
                        style={{ borderRadius: "10px", color: "black", fontWeight: "bold" }}
                        icon="pi pi-check"
                        onClick={deleteUser}
                    />
                </div>
            </React.Fragment>
        );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <DataTable
                    stripedRows
                    ref={dt}
                    removableSort
                    value={allUsers}
                    responsiveLayout="scroll"
                    tableStyle={{ minWidth: "70rem" }}
                    dataKey="id"
                    globalFilter={globalFilter}
                    header={header}
                    selectionMode="single"
                >
                    <Column field="userRole" header="Role" />
                    <Column field="username" header="Username" />
                    <Column field="name" header="Name" />
                    <Column field="description" header="Description" />
                    <Column field="additionalInfo" header="Additional Info" />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: "8rem" }} />
                </DataTable>

                <div className="paginator">
                    <Button
                        style={{ borderRadius: "10px", backgroundColor: "#ffebcd", marginRight: "1rem" , color: "black"}}
                        label="Previous Page"
                        icon="pi pi-angle-left"
                        className="p-button-outlined"
                        onClick={() => {
                            setCurrentPage(currentPage - 1);
                        }}
                        disabled={currentPage === 1}
                    />
                    <p>{currentPage}</p>
                    <Button
                        disabled={allUsers.length < pageSize}
                        style={{ borderRadius: "10px", backgroundColor: "#ffebcd", marginLeft: "1rem", color: "black" }}
                        label="Next Page"
                        icon="pi pi-angle-right"
                        className="p-button-outlined"
                        onClick={() => {
                            setCurrentPage(currentPage + 1);
                        }}
                    />
                    <Dropdown
                        style={{ marginLeft: "1rem" }}
                        value={pageSize}
                        options={[10, 25, 50]}
                        onChange={(e) => {
                            setPageSize(e.value);
                            setCurrentPage(1);
                        }}
                        placeholder={"pageSize"}
                        className="p-ml-3"
                    />
                </div>
            </div>

            <Dialog
                visible={userDialog}
                style={{ minWidth: "48rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                modal
                className="p-fluid"
                footer={userDialogFooter}
                onHide={hideDialog}
            >
                <div className="dialog-container">
                    <div className="dialog-row">
                        <div className="field">
                            <label htmlFor="name" className="font-bold">
                                Name
                            </label>
                            <InputText
                                id="name"
                                value={user.name}
                                onChange={(e) => onInputChange(e, "name")}
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !user.name })}
                            />
                            {submitted && !user.name && <small className="p-error">Name is required</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="userRole" className="font-bold">
                                Role
                            </label>
                            <InputText
                                id="role"
                                value={user.role}
                                onChange={(e) => onInputChange(e, "userRole")}
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !user.role })}
                            />
                            {submitted && !user.authRole && <small className="p-error">Role is required</small>}
                        </div>
                    </div>

                    <div className="dialog-row">
                        <div className="field">
                            <label htmlFor="username" className="font-bold">
                                Username
                            </label>
                            <InputText
                                id="username"
                                value={user.username}
                                onChange={(e) => onInputChange(e, "username")}
                                required
                                className={classNames({ "p-invalid": submitted && !user.username })}
                            />
                            {submitted && !user.username && <small className="p-error">Username is required</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="password" className="font-bold">
                                Password
                            </label>
                            <InputText
                                id="password"
                                value={user.password}
                                onChange={(e) => onInputChange(e, "password")}
                                required
                                className={classNames({ "p-invalid": submitted && !user.password })}
                            />
                            {submitted && !user.password && <small className="p-error">Password is required</small>}
                        </div>
                    </div>

                    <div className="dialog-row">
                        <div className="field">
                            <label htmlFor="description" className="font-bold">
                                Description
                            </label>
                            <InputTextarea
                                id="description"
                                value={user.description}
                                onChange={(e) => onInputChange(e, "description")}
                                style={{ minHeight: "150px", minWidth: "300px" }}
                                className={classNames({ "p-invalid": submitted && !user.description })}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="additionalInfo" className="font-bold">
                                Additional Info
                            </label>
                            <InputTextarea
                                id="additionalInfo"
                                value={user.additionalInfo}
                                onChange={(e) => onInputChange(e, "additionalInfo")}
                                style={{ minHeight: "150px", minWidth: "300px" }}
                                className={classNames({ "p-invalid": submitted && !user.additionalInfo })}
                            />
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteUserDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: "2rem" }} />
                    {user && (
                        <span>
                            Are you sure you want to delete <b>{user.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
};

export default UserTable;