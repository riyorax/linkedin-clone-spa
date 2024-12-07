import { useProfile } from "@/context/ProfileContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";



const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const Login = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false);
  const { profile, refetchProfile } = useProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email: values.email,
        password: values.password,
      },
        {
          withCredentials: true
        });

      const success = response.data.success;

      if (success) {
        toast.toast({
          title: "Login successful",
          description: "Redirecting to feed...",
          duration: 3000,
        })

        navigate("/feed");
      } else {
        toast.toast({
          title: "Login failed",
          description: response.data.message,
          duration: 3000,
        })
      }
      refetchProfile();
    } catch (e) {
      console.error(e)
      toast.toast({
        title: "Login failed",
        description: (e as Error).message,
        duration: 3000,
      })
    }
  }

  return (
    <>
      {profile ? (
        <>
          <div className="container mx-auto py-20 px-8 lg:px-40 mx-auto flex flex-col items-center justify-center space-y-6">
            <div className="flex w-full items-center justify-center space-x-2 sm:space-x-4">
              <Link to="/" className="flex-shrink-0">
                <svg className="text-bluelinkedin h-4 w-4 sm:h-8 sm:w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
              <h1 className="text-xl sm:text-3xl font-semibold text-center">LinkinPurry</h1>
            </div>
            <Card className="overflow-hidden w-full max-w-md bg-white shadow-lg rounded-lg">
              <CardHeader className="space-y-2">
                <CardTitle className="text-l sm:text-xl font-semibold text-center">Welcome Back!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-6">
                  <p className="text-[12px] sm:text-sm">Already Login</p>
                  <p className="text-[12px] sm:text-sm text-bluelinkedin">Redirecting to feed...</p>
                </div>
              </CardContent>
            </Card>
          </div>
          {setTimeout(() => {
            navigate("/feed");
          }, 2000)};
        </>
      ) : (
        <div className="container mx-auto py-20 px-8 lg:px-40 mx-auto flex flex-col items-center justify-center space-y-6">
          <div className="flex w-full items-center justify-center space-x-2 sm:space-x-4">
            <Link to="/" className="flex-shrink-0">
              <svg className="text-bluelinkedin h-4 w-4 sm:h-8 sm:w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
            <h1 className="text-xl sm:text-3xl font-semibold text-center">LinkinPurry</h1>
          </div>
          <Card className="overflow-hidden w-full max-w-md bg-white shadow-lg rounded-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-l sm:text-xl font-semibold text-center">Welcome Back!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[12px] sm:text-sm">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your@email.com"
                            className="text-[12px] sm:text-sm border border-gray-300 rounded-md p-2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[12px] sm:text-sm">Password</FormLabel>
                        <FormControl>
                          <div className="flex items-center justify-center space-x-2">
                            <Input
                              type={showPassword ? "text" : "password"}
                              className="text-[12px] sm:text-sm border border-gray-300 rounded-md p-2"
                              {...field}
                            />
                            <Button
                              type="button"
                              className="p-2 border-2 border-gray-200 shadow-none bg-white rounded-m hover:bg-white"
                              onClick={() => setShowPassword((prev) => !prev)}
                            >
                              {showPassword ? <EyeOff className="text-black"></EyeOff> : <Eye className="text-black"></Eye>}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="text-[12px] sm:text-sm w-full sm:h-12 text-white bg-bluelinkedin rounded-full hover:bg-bluehover hover:text-white">
                    Login
                  </Button>
                </form>
              </Form>
              <div className="text-[12px] sm:text-sm flex space-x-1 item-center justify-center text-center">
                <p>Don't have an account?</p>
                <Link to="/register" className="text-bluelinkedin hover:text-bluehover hover:scale-105">
                  Register
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default Login;