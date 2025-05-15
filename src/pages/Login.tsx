
import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import { loginUser } from "@/api/usersService"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const setUser = useAuthStore((state) => state.setUser)
  const setToken = useAuthStore((state) => state.setToken)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for saved email in localStorage if remember me was checked
    const savedEmail = localStorage.getItem("rememberedEmail")
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }

    // Show toast message if exists
    const message = localStorage.getItem("toastMessage")
    if (message) {
      toast.success(message)
      localStorage.removeItem("toastMessage")
    }
  }, [])

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    let isValid = true

    if (!email) {
      newErrors.email = "Email é obrigatório"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória"
      isValid = false
    } else if (password.length < 2) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const data = await loginUser({ email, password })

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }

      setUser(data.user)
      setToken(data.token)
      sessionStorage.setItem("token", data.token)

      toast.success("Login realizado com sucesso!")
      navigate("/dashboards")
    } catch (error: any) {
      console.error("Erro ao fazer login:", error)

      // Handle different error types
      if (error.response?.status === 401) {
        toast.error("Email ou senha incorretos")
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Erro ao fazer login. Por favor, tente novamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 ">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <LogIn className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Bem-vindo de volta</h1>
          <p className="text-slate-500">Entre com sua conta para continuar</p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="google" disabled>
              Google
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Card className="border-slate-200 shadow-lg py-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Login com Email</CardTitle>
                <CardDescription>Digite seu email e senha para acessar sua conta</CardDescription>
              </CardHeader>

              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (errors.email) setErrors({ ...errors, email: undefined })
                        }}
                        className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Senha
                      </Label>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-sm font-medium text-emerald-600 hover:text-emerald-700"
                        onClick={() => navigate("/forgot-password")}
                      >
                        Esqueceu a senha?
                      </Button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (errors.password) setErrors({ ...errors, password: undefined })
                        }}
                        className={`pl-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                        <span className="sr-only">{showPassword ? "Ocultar senha" : "Mostrar senha"}</span>
                      </Button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)
                        
                       }
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Lembrar meu email
                    </Label>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Entrando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Entrar
                      </span>
                    )}
                  </Button>

                  <div className="text-center text-sm">
                    <span className="text-slate-500">Não possui uma conta? </span>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-sm font-medium text-emerald-600 hover:text-emerald-700"
                      onClick={() => navigate("/register")}
                    >
                      Registre-se aqui
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="google">
            <Card>
              <CardHeader>
                <CardTitle>Google</CardTitle>
                <CardDescription>Login com sua conta Google (em breve)</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Sua Empresa. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}

export default Login
