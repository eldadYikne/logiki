import { useEffect, useState } from "react";
import { Table, Button, Modal, Input } from "rsuite";
import { v4 as uuidv4 } from "uuid";
import { Admin, TableData } from "../types/table";
import { getAuth, User } from "firebase/auth";
import { getAllBoards } from "../service/dashboard";

interface DashboardProps {
  user?: User;
}

function Dashboard({ user }: DashboardProps) {
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<TableData | null>(null);
  const [data, setData] = useState<TableData[]>();

  const [newAdmin, setNewAdmin] = useState<Omit<Admin, "id">>({
    email: "",
    signature: "",
    dateFirstSignIn: "",
    name: "",
    phone: "",
    personalNumber: 0,
    rank: "",
    isSuperAdmin: false,
  });
  useEffect(() => {
    async function fetch() {
      try {
        const auth = getAuth();
        console.log("Current User:", auth.currentUser?.email);
        let da = await getAllBoards();
        console.log("da,da", da);
        if (da) {
          //   setData(da as TableData[]);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetch();
  }, [user]);
  const handleAction = (rowData: TableData) => {
    setSelectedData(rowData);
    setOpen(true);
  };

  const handleCreate = () => {
    const newTableData: TableData = {
      id: uuidv4(),
      soldiers: [],
      items: [],
      admins: [],
      teams: [],
      itemsTypes: [],
      actions: [],
      sentSignatures: [],
      optionalAdmins: [],
    };
    if (data) {
      setData([...data, newTableData]);
    }
  };

  const handleAddAdmin = (id: string) => {
    const updatedData = data?.map((entry) => {
      if (entry.id === id) {
        const newAdminEntry: Admin = { id: uuidv4(), ...newAdmin };
        return { ...entry, admins: [...entry.admins, newAdminEntry] };
      }
      return entry;
    });
    setData(updatedData);
    setNewAdmin({
      email: "",
      signature: "",
      dateFirstSignIn: "",
      name: "",
      phone: "",
      personalNumber: 0,
      rank: "",
      isSuperAdmin: false,
    });
  };

  return (
    <div>
      {data && data.length > 0 && (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <Button appearance="primary" onClick={handleCreate} className="mb-4">
            Create New TableData
          </Button>
          <Table height={400} data={data} bordered cellBordered>
            <Table.Column width={200} fixed>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.Cell dataKey="id" />
            </Table.Column>
            <Table.Column flexGrow={1}>
              <Table.HeaderCell>Admins</Table.HeaderCell>
              <Table.Cell>{(rowData) => rowData.admins.length}</Table.Cell>
            </Table.Column>
            <Table.Column flexGrow={1}>
              <Table.HeaderCell>Actions</Table.HeaderCell>
              <Table.Cell>
                {(rowData) => (
                  <div className="flex gap-2">
                    <Button
                      appearance="primary"
                      onClick={() => handleAction(rowData as TableData)}
                    >
                      View
                    </Button>
                    <Button
                      appearance="ghost"
                      onClick={() => handleAddAdmin(rowData.id)}
                    >
                      Add Admin
                    </Button>
                  </div>
                )}
              </Table.Cell>
            </Table.Column>
          </Table>

          {/* Modal for detailed view */}
          <Modal open={open} onClose={() => setOpen(false)}>
            <Modal.Header>
              <Modal.Title>Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedData && (
                <div>
                  <p>
                    <strong>ID:</strong> {selectedData.id}
                  </p>
                  <p>
                    <strong>Admins:</strong> {selectedData.admins.length}
                  </p>
                  <div className="mt-4">
                    <Input
                      placeholder="Name"
                      value={newAdmin.name}
                      onChange={(value) =>
                        setNewAdmin({ ...newAdmin, name: value })
                      }
                    />
                    <Input
                      placeholder="Email"
                      value={newAdmin.email}
                      onChange={(value) =>
                        setNewAdmin({ ...newAdmin, email: value })
                      }
                    />
                    <Input
                      placeholder="Phone"
                      value={newAdmin.phone}
                      onChange={(value) =>
                        setNewAdmin({ ...newAdmin, phone: value })
                      }
                    />
                    <Input
                      placeholder="Rank"
                      value={newAdmin.rank}
                      onChange={(value) =>
                        setNewAdmin({ ...newAdmin, rank: value })
                      }
                    />
                    <Input
                      placeholder="Signature"
                      value={newAdmin.signature}
                      onChange={(value) =>
                        setNewAdmin({ ...newAdmin, signature: value })
                      }
                    />
                    <Input
                      placeholder="Personal Number"
                      type="number"
                      value={newAdmin.personalNumber.toString()}
                      onChange={(value) =>
                        setNewAdmin({
                          ...newAdmin,
                          personalNumber: Number(value),
                        })
                      }
                    />
                    <Button
                      className="mt-2"
                      appearance="primary"
                      onClick={() => handleAddAdmin(selectedData.id)}
                    >
                      Add Admin
                    </Button>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setOpen(false)} appearance="subtle">
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
