import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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


const formSchema = z
  .object({
    username: z.string().min(4, "Username must be at least 4 characters."),
    email: z.string().email("Please enter a valid email."),
    fullname: z.string().min(4, "Full name must be at least 4 characters."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Error path
  });

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      fullname: "",
      password: "",
      confirmPassword: "",
    },
  })


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.password !== values.confirmPassword) {
      toast.toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        duration: 2000,
      })
    }

    try {
      const response = await axios.post("http://localhost:3000/api/register", {
        username: values.username,
        email: values.email,
        name: values.fullname,
        password: values.password,
        confirmPassword: values.confirmPassword,
      },
      { 
        withCredentials: true 
      });

      const success = response.data.success;

      if (success){
        toast.toast({
          title: "Registration successful",
          description: "Automatically logging you in..., Redirecting to profile...",
          duration: 3000,
        })

        navigate("/profile")
      }
      else {
        toast.toast({
          title: "Login failed",
          description: response.data.message,
          duration: 3000,
        })
      }
    }
    catch (err) {
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
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

export default Register;