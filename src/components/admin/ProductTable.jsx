import React, { useContext, useEffect, useRef, useState } from "react";
import useProduct from "../../hooks/useProduct";
import { Context } from "../../Context";
import { createEntity, deleteEntityById, editEntityById } from "../../services/api";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";

const ProductTable = () => {
    const {user} = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const {allProducts, refreshProducts} = useProduct(currentPage, pageSize);
    const toast = useRef(null);
    const dt = useRef(null);
    const [product, setProduct] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);

    const openNewDialog = () => {
        // open new product dialog
        setProduct({});
        setSubmitted(false);
        setProductDialog(true);
    }

    useEffect(() => {
        refreshProducts();
    }, [pageSize, currentPage]);

    const hideDialog = () => {
        // hide new product dialog when editing or creating is done
        setSubmitted(true);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        // hide delete dialog when deleting a product is done
        setDeleteProductDialog(false);
    };

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
          const worksheet = xlsx.utils.json_to_sheet(allProducts);
          const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
          const excelBuffer = xlsx.write(workbook, {
            bookType: "xlsx",
            type: "array"
          });
    
          saveAsExcelFile(excelBuffer, "products");
        });
    };

    const saveProduct = () => {
        // create a new product if id not found, otherwise edit product with id
        if(product.id == null) {
            createEntity("Product", user, user.token).then(() => {
                setSubmitted(true);
                toast.current.show({ severity: "success", summary: "Successfully", detail: "Product created", life: 3000 });
                setProductDialog(false);
                refreshProducts();
                setProduct({});
            });
        }
        else {
            editEntityById("Product", product.id, product, user.token).then(() => {
                setSubmitted(true);
                toast.current.show({ severity: "success", summary: "Successfully", detail: "Product updated", life: 3000 });
                setProductDialog(false);
                refreshProducts();
                setProduct({})
            })
        }
    }

    const editProduct = (product) => {
        // open dialog for edting a product
        setProduct({...product});
        setProductDialog(true);
    }

    const deleteProduct = () => {
        // delete product if confirmed
        deleteEntityById("Product", product.id, user.token).then(() => {
            setProductDialog(false);
            setProduct({});
            toast.current.show({ severity: "success", summary: "Successfully", detail: "Product deleted", life: 3000 });
            refreshProducts();
        });
    }

    const confirmDeleteProduct = (product) => {
        // confirm if product should be deleted
        setProduct(user);
        setDeleteProductDialog(true);
    }

    const onInputChange = (e, name) => {
        // on input change, set property on product object
        const val = (e.target && e.target.value) || e.value || "";
        let _product = { ...product };
        _product[`${name}`] = val;
        setProduct(_product);
    }

    const actionBodyTemplate = (rowData) => {
        // action body template for edit and delete buttons
        return (
            <React.Fragment>
                <Button
                    style={{ backgroundColor: "#ffebcd" }}
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success p-mr-2"
                    onClick={() => editProduct(rowData)}
                />
                <Button 
                    style={{backgroundColor: "#ffebcd"}}
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => confirmDeleteProduct(rowData)}
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
                <Button label="Create new product" style={{ borderRadius: "10px", backgroundColor: "#ffebcd" }} icon="pi pi-plus" severity="success" onClick={openNewDialog} />
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

    const productDialogFooter = (
        <React.Fragment>
            <div className="dialog-row">
                <Button label="X" icon="pi pi-times" className="p-button-outlined" style={{ borderRadius: "10px", color: "black", fontWeight: "bold" }} onClick={hideDialog} />
                <Button
                    label="Save"
                    className="pi-button-text"
                    style={{ borderRadius: "10px", color: "black", fontWeight: "bold" }}
                    icon="pi pi-check"
                    onClick={saveProduct}
                />
            </div>
        </React.Fragment>
    );

    const deleteProductDialogFooter = // delete user dialog footer template
    (
        <React.Fragment>
            <div className="dialog-row">
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    className="p-button-outlined"
                    style={{ borderRadius: "10px", color: "#ffebcd", fontWeight: "bold" }}
                    onClick={hideDeleteProductDialog}
                />
                <Button
                    label="Delete"
                    className="pi-button-text"
                    style={{ borderRadius: "10px", color: "#ffebcd", fontWeight: "bold" }}
                    icon="pi pi-check"
                    onClick={deleteProduct}
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
                    value={allProducts}
                    responsiveLayout="scroll"
                    tableStyle={{ minWidth: "70rem" }}
                    dataKey="id"
                    globalFilter={globalFilter}
                    header={header}
                    selectionMode="single"
                >
                    <Column field="id" header="Id" />
                    <Column field="name" header="Name" />
                    <Column field="quantity" header="Quantity" />
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
                        disabled={allProducts.length < pageSize}
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
                visible={productDialog}
                style={{ minWidth: "48rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                modal
                className="p-fluid"
                footer={productDialogFooter}
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
                                value={product.name}
                                onChange={(e) => onInputChange(e, "name")}
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !user.name })}
                            />
                            {submitted && !product.name && <small className="p-error">Name is required</small>}
                        </div>
                    </div>
                    <div className="dialog-row">
                        <div className="field">
                            <label htmlFor="description" className="font-bold">
                                Description
                            </label>
                            <InputTextarea
                                id="description"
                                value={product.description}
                                onChange={(e) => onInputChange(e, "description")}
                                style={{ minHeight: "150px", minWidth: "300px" }}
                                className={classNames({ "p-invalid": submitted && !product.description })}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="additionalInfo" className="font-bold">
                                Additional Info
                            </label>
                            <InputTextarea
                                id="additionalInfo"
                                value={product.additionalInfo}
                                onChange={(e) => onInputChange(e, "additionalInfo")}
                                style={{ minHeight: "150px", minWidth: "300px" }}
                                className={classNames({ "p-invalid": submitted && !product.additionalInfo })}
                            />
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: "2rem" }} />
                    {user && (
                        <span>
                            Are you sure you want to delete <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    )
};

export default ProductTable;