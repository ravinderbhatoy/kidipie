import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./AuthContext"

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth()
    return (
        <div>ProtectedRoute</div>
    )
}

export default ProtectedRoute