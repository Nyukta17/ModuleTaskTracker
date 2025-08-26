import { useState } from "react";
import { Button } from "react-bootstrap";
import ApiRoute from "../api/ApiRoute";
import { useNavigate } from 'react-router-dom';

const api = new ApiRoute;


let AuthForm = () => {
    const [isLog, setIsLog] = useState(true);
    return (<>
        {isLog ? <SingIn /> : <SingUp />}
        <Button onClick={() => setIsLog(!isLog)}>
            {isLog ? "Перейти к регистрации" : "Перейти ко входу"}
        </Button>
    </>)

}

let SingIn = () => {
    const [companyOrEmail, setCompanyOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    let Authentication = async () => {
        try {

            const bodyData: Record<string, string> = { password };
            if (companyOrEmail.includes("@")) {
                bodyData.email = companyOrEmail;
            }
            else {
                bodyData.company = companyOrEmail
            }

            const response = await fetch(api.SingIn(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData)
            })
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "Неверный логин или пароль");
                return;
            }

            const date = await response.text();

            if (date) {
                localStorage.setItem("jwtToken", date);
                navigate("/MainMenu")
                
            } else {
                console.log("сервер ответил->" + date)
                throw new Error("Токен не получен");
            }
        }
        catch (error) {
            console.error("Ошибка при входе:", error)
        }
    }
    return (<>
        <h1>Вход</h1>
        <input type="text" name="CompanyOrEmail" value={companyOrEmail} onChange={(e) => setCompanyOrEmail(e.target.value)} />
        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={Authentication}>Войти</Button>
        {error && <div style={{ color: "red" }}>{error}</div>}
    </>)
}

let SingUp = () => {
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [messag,setMessag] = useState("");

    const handlePasswordChange = (value: string) => {
        setPassword(value);

        if (confirmPassword && value != confirmPassword) {
            setError("Пароли не совпадают")
        }
        else {
            setError(null);
        }
    }

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        if (password !== value) {
            setError("Пароли не совпадают");
        } else {
            setError(null);
        }
    };

    const Registration = async () => {
        try {
            const response = await fetch(
                api.SingUp(), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "company": company, "email": email, "password": password })
            }
            )
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "Неверный логин или пароль");
                return;
            }
            const text = await response.text();
            setMessag(text);
        }

        catch (error) {
            console.log("Ошибка при регистрации: ", error)
        }
    }

    return (<>
        <h1>Окно регистрации</h1>
        <input type="text" name="company" value={company} onChange={(e) => setCompany(e.target.value)} />
        <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
        />
        <input
            type="password"
            placeholder="Подтверждение пароля"
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
        <Button onClick={Registration}>Зарегистрироваться</Button>
        {messag && <div style={{ color: "red" }}>{messag}</div>}
    </>)
}




export default AuthForm