import { setError, setUser, setLoading } from "../state/auth.slice";
import { register, login, getMe } from "../service/auth.api";
import { useDispatch } from "react-redux";


export const useAuth = () => {
    const dispatch = useDispatch();
    async function handleRegister({ email, contact, password, fullname, isSeller = false }) {
      try{
          const data = await register({ email, contact, password, fullname, isSeller })
        dispatch(setUser(data.user))
        return data.user;
      }finally{
                dispatch(setLoading(false))
      }
    }
    async function handleLogin({ email, password }) {
        try {
            const data = await login({ email, password });

            dispatch(setUser(data.user));

            return data.user;
        } finally {
            dispatch(setLoading(false));
        }
    }
    async function handleGetMe() {
        try {
            const data = await getMe();
            console.log("GET ME RESPONSE:", data);
            dispatch(setUser(data.user));
        } catch (err) {
            console.log("Get Me Error:", err);
            dispatch(setUser(null));
        } finally {
            dispatch(setLoading(false));
        }
    }
    return { handleRegister, handleLogin, handleGetMe };
}