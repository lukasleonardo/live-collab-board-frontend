import React, { useEffect, useState } from "react"
import { loginUser } from "@/api/usersService";
import { useAuthStore } from "../store/useAuthStore";
import {useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const setUser = useAuthStore((state) => state.setUser);
    const setToken = useAuthStore((state) => state.setToken);
    const navigate = useNavigate();

    useEffect(() => {
      const message = localStorage.getItem("toastMessage");
      if (message) {
        toast.success(message);
        localStorage.removeItem("toastMessage");
      }
    }, []);
    

    const handleLogin = async (e:React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await loginUser({ email, password });
            setUser(data.user);
            setToken(data.token);
            sessionStorage.setItem('token', data.token);
            navigate('/dashboards');

        } catch (error) {
            console.log(error);
            alert("Erro ao fazer login. Verifique suas credenciais.");
        }finally {
            setIsLoading(false);
        }
    }
    
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">

      <Card className="w-full max-w-lg lg:max-w-4xl ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
        <div className="m-4 text-center text-sm">
          <p>Não possui uma conta <a onClick={() => navigate('/register')}>Registre-se aqui.</a></p>
        </div>
      </Card>
    </div>
    
    )
}



export default Login
