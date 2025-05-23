import { registerUser } from "@/api/usersService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userFormSchema } from "@/schemas/userSchema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');

    const navigate = useNavigate();


    const handleRegister= async (e:React.FormEvent) =>{
        e.preventDefault();
        try{
            const data = {name, email, password};
            const result = userFormSchema.safeParse(data);
            const response = await registerUser(result.data);
            console.log(response);
            localStorage.setItem("toastMessage", "Usuário cadastrado com sucesso!");
            navigate('/login');
        }catch(error){
            console.log("Erro ao cadastrar usuário" + error);
            alert("Erro ao cadastrar usuário " + error)
        }  
    }

    return (
        <div className="flex w-full h-screen items-center justify-center m-auto bg-gray-50 px-4  sm:px-6 lg:px-8">
            <Card className="w-full max-w-3/5 min-w-sm py-6">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl font-bold">Register</CardTitle>
                    <CardDescription>Register to create a new account</CardDescription>
                </CardHeader>              
                <CardContent>
                    <form onSubmit={handleRegister}>
                        <div className="info-container grid grid-cols-1 gap-4">
                            <div className="name-container space-y-2">
                                <Label htmlFor="name">Nome:</Label>
                                <Input id="name" type="text" value={name} required
                                onChange={(e) => setName(e.target.value)} placeholder="Insira seu nome."/>
                            </div>
                            <div className="email-container space-y-2">
                                <Label htmlFor="email">Email:</Label>
                                <Input id="email" type="email" value={email} required
                                onChange={(e) => setEmail(e.target.value)} placeholder="email@domain.com"/>
                            </div>
                        
                            <div className="container space-y-2">
                                <Label htmlFor="password">Password:</Label>
                                <Input id="password" type="password" value={password} required
                                onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                            </div>
                            <div className="container space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password:</Label>
                                <Input id="confirm-password" type="password" required
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                            </div>  
                        </div>
                        <div className="btns mt-4 flex gap-2 justify-2">
                        <Button type="reset" className="hover:bg-amber-300">Clear</Button>
                        <Button type="submit" className="bg-emerald-600w-full bg-emerald-600 hover:bg-emerald-700 text-white">Register</Button>
                        </div>
                    </form> 
                </CardContent>
                <CardFooter>
                    <span>Já possui uma conta? <a onClick={()=>navigate('/login')}>sign in</a></span>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Register