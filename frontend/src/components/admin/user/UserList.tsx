import { useState } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormattedUserType } from "@/utils/types/UserType";
import { ConfirmationDialog } from "../../ui/ConfirmationDialog";
import { FaSortDown, FaSortUp, FaSpinner } from "react-icons/fa";
import Pagination from "../../ui/Pagination";
import CustomeFilter from "../../ui/CustomeFilter";

interface UserListProps {
    users: FormattedUserType[];
    loading: boolean;
    onEdit: (user: FormattedUserType) => void;
    onDelete: (id: string) => void;
}

const url = import.meta.env.VITE_API_URL

export const UserList = ({ users, loading, onEdit, onDelete }: UserListProps) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<FormattedUserType | null>(null);
    const [sortBy, setSortBy] = useState<keyof FormattedUserType | "">("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset ke halaman pertama setelah search
    };

    const handleDeleteClick = (user: FormattedUserType) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            onDelete(userToDelete.id);
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    // Filter kategori berdasarkan searchTerm
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);



    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortBy) return 0;

        const valueA = a[sortBy];
        const valueB = b[sortBy];

        if (typeof valueA === "string" && typeof valueB === "string") {
            return sortDirection === "asc"
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        }

        return 0;
    });

    const paginatedUsers = sortedUsers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleSort = (field: keyof FormattedUserType) => {
        if (sortBy === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortDirection("asc");
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const renderSortIcon = (field: keyof FormattedUserType) => {
        if (sortBy !== field) return null;
        return sortDirection === "asc" ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />;
    };

    if (loading) {
        return (
            <Box className="w-full h-[200px] flex flex-col justify-center items-center gap-4">
                <FaSpinner className="animate-spin text-primary text-3xl" />
                <p className="text-gray-600 text-lg">Loading...</p>
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ width: '100%' }}>
                {/* === Custom Filter (Show per Page + Search) === */}
                <CustomeFilter
                    pagination={rowsPerPage}
                    setPagination={(value) => {
                        setRowsPerPage(value);
                        setCurrentPage(1); // Reset halaman saat ubah jumlah rows
                    }}
                    searchTerm={searchTerm}
                    handleSearchChange={handleSearchChange}
                />

                {/* === Table === */}
                <TableContainer>
                    <Table aria-label="user table">
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Avatar</TableCell>
                                <TableCell onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                                    Name {renderSortIcon("name")}
                                </TableCell>
                                <TableCell onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                                    Email {renderSortIcon("email")}
                                </TableCell>
                                <TableCell onClick={() => handleSort("role")} style={{ cursor: "pointer" }}>
                                    Role {renderSortIcon("role")}
                                </TableCell>
                                <TableCell onClick={() => handleSort("created_at_formatted")} style={{ cursor: "pointer" }}>
                                    Created At {renderSortIcon("created_at_formatted")}
                                </TableCell>
                                <TableCell onClick={() => handleSort("updated_at_formatted")} style={{ cursor: "pointer" }}>
                                    Last Updated {renderSortIcon("updated_at_formatted")}
                                </TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedUsers.map((user, index) => (
                                <TableRow key={user.id} hover>
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <img
                                            src={user.avatar ? `${url}/storage/${user.avatar}` : `/img/profile.png`}
                                            alt={user.name}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                margin: 'auto', // center align image
                                                display: 'block',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="capitalize">{user.role}</TableCell>
                                    <TableCell>{user.created_at_formatted}</TableCell>
                                    <TableCell>{user.updated_at_formatted}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => onEdit(user)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteClick(user)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredUsers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* === Custom Pagination === */}
                <Box className="w-full flex justify-end items-center py-4 gap-2">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </Box>
            </Box>

            {/* === Confirmation Dialog === */}
            <ConfirmationDialog
                open={deleteDialogOpen}
                title="Delete User"
                content={`Are you sure you want to delete the user "${userToDelete?.name}"?`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteDialogOpen(false)}
            />
        </>
    );
};
