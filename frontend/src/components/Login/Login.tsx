import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Header } from "../Header/Header";
import { useToast } from "@/hooks/use-toast";



const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const Login = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // // const [msg, setMsg] = useState("");
  const navigate = useNavigate()
  const toast = useToast()

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
          description: "Redirecting to profile...",
          duration: 2000,
        })

        navigate("/profile");
      } else {
        toast.toast({
          title: "Login failed",
          description: response.data.message,
          duration: 3000,
        })
      }
    } catch (err) {
      console.error(err)
      toast.toast({
        title: "Login failed",
        description: err.message,
        duration: 3000,
      })
    }
  }

  return (
    <>
    <Header/>
    <section className="container mx-auto w-1/2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
    </section>
  </>
  )
}

export default Login;