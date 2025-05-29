import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  SelectChangeEvent
} from "@mui/material";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    status: "Active",
  });

  const fetchUsers = async() => {

  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingUserId(null);
    setFormData({ name: "", email: "", phone: "", gender: "", status: "Active" });
    setError(null);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name as string]: value });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!formData.name || !formData.email || !formData.phone || !formData.gender) {
      setError("Please fill all required fields.");
      setSubmitting(false);
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone must be exactly 10 digits.");
      setSubmitting(false);
      return;
    }

    if (editingUserId) {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === editingUserId
            ? { ...user, ...formData, updatedAt: new Date().toISOString() }
            : user
        )
      );
      setSuccess("User updated successfully!");
    } else {
      setUsers((prev) => [
        ...prev,
        {
          _id: generateId(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
      setSuccess("User created successfully!");
    }
    handleClose();
    setSubmitting(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setUsers((prev) => prev.filter((user) => user._id !== id));
    setSuccess("User deleted successfully!");
  };

  const handleEdit = (id: string) => {
    const userToEdit = users.find((user) => user._id === id);
    if (userToEdit) {
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone,
        gender: userToEdit.gender,
        status: userToEdit.status,
      });
      setEditingUserId(id);
      handleOpen();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Management</h1>
      <Paper sx={{ mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(user._id)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ margin: 2 }}
        >
          + Create User
        </Button>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingUserId ? "Edit User" : "Create User"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              paddingTop: "20px",
              minWidth: "350px"
            }}
          >
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ pattern: "\\d{10}" }}
              helperText="10 digits"
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                <FormControlLabel value="Others" control={<Radio />} label="Others" />
              </RadioGroup>
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleSelectChange}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            {error && (
              <Alert severity="error">{error}</Alert>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? <CircularProgress size={24} />
                  : editingUserId ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </form>
      </Dialog>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default App;
