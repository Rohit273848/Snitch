import { setError, setUser, setLoading } from "../state/auth.slice";
import { register } from "../service/auth.api";
import { useDispatch } from "react-redux";


export const useAuth = () => {
    const dispatch = useDispatch();
    async function handleRegister(email, contact, password, fullname, isSeller = false) {
        const data = await register({ email, contact, password, fullname, isSeller })
        dispatch(setUser(data.user))
        dispatch(setLoading(false))
    }
    return { handleRegister };
}