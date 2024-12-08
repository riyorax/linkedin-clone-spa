'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Trash } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ProfileData } from "@/type/Profile";
import axios from 'axios'
import { useProfile } from '@/context/ProfileContext'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  initialData: {
    username: string
    name: string
    workHistory: string
    skills: string
    profile_photo?: string
  }
  onProfileUpdate: (updatedData: Partial<ProfileData>) => void;
}

interface FormErrors {
  username?: string
  name?: string
  workHistory?: string
  skills?: string
  profile_photo?: string
}

export function EditProfileModal({ isOpen, onClose, userId, initialData, onProfileUpdate }: EditProfileModalProps) {
  const { refetchProfile } = useProfile();
  const [formData, setFormData] = useState(initialData)
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [previousPhoto, setPreviousPhoto] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0])
      setPreviousPhoto(initialData.profile_photo)
      setErrors(prev => ({ ...prev, profile_photo: '' }))
    }
  }

  const handleRemovePhoto = () => {
    setProfilePhoto(null)
    setPreviousPhoto(formData.profile_photo)
    setFormData(prev => ({ ...prev, profile_photo: undefined }))
    const fileInput = document.getElementById('profile_photo') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (formData.username.trim().length < 4) newErrors.username = "Username must be at least 4 characters."
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (formData.name.trim().length < 4) newErrors.name = "Full name must be at least 4 characters."
    if (profilePhoto && profilePhoto.size > 10 * 1024 * 1024) {
      newErrors.profile_photo = "Profile photo must be less than 10MB"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    const submitData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined) {
        submitData.append(key, value)
      }
    })
    if (profilePhoto) {
      submitData.append('profile_photo', profilePhoto)
    }
    if (previousPhoto) {
      submitData.append('previous_photo', previousPhoto)
    }
    
    try {
      refetchProfile();
      const response = await axios.put(
        `http://localhost:3000/api/profile/${userId}`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response.status === 200 && response.data.success) {
        toast.toast({
          title: "Edit Successful",
          description: "User data updated successfully.",
          duration: 2000,
        })
        // console.log(response.data.body);
        onProfileUpdate(response.data.body);
        onClose()
      } else {
        toast.toast({
          title: "Edit Failed",
          description: response.data.message || "Failed to update user data.",
          duration: 2000,
        })
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        const message = e.response.data.message || "An error occurred";
        toast.toast({
          title: "Edit Failed",
          description: message,
          duration: 3000,
        });
      } else {
        toast.toast({
          title: "Edit Failed",
          description: (e as Error).message || "An unexpected error occurred.",
          duration: 2000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    setFormData(initialData);
    setProfilePhoto(null);
    setPreviousPhoto(undefined);
  }, [initialData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[300px] sm:max-w-[425px] md:max-w-[600px] rounded-md">
        <DialogHeader>
          <DialogTitle className="text-center text-bluelinkedin text-lg sm:text-xl md:text-2xl">Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="text-[10px] sm:text-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[10px] sm:text-sm">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`text-[10px] sm:text-sm ${errors.username ? 'border-red-500' : ''}`}
            />
            {errors.username && <p className="text-red-500 text-[8px] sm:text-xs">{errors.username}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] sm:text-sm">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`text-[10px] sm:text-sm ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-[8px] sm:text-xs">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="workHistory" className="text-[10px] sm:text-sm">Work History</Label>
            <Textarea
              id="workHistory"
              name="workHistory"
              value={formData.workHistory}
              onChange={handleInputChange}
              rows={3}
              className={`text-[10px] sm:text-sm ${errors.workHistory ? 'border-red-500' : ''}`}
            />
            {errors.workHistory && <p className="text-red-500 text-[8px] sm:text-xs">{errors.workHistory}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills" className="text-[10px] sm:text-sm">Skills</Label>
            <Textarea
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              rows={3}
              className={`text-[10px] sm:text-sm ${errors.skills ? 'border-red-500' : ''}`}
            />
            {errors.skills && <p className="text-red-500 text-[8px] sm:text-xs">{errors.skills}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile_photo" className="text-[10px] sm:text-sm">Profile Photo</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="profile_photo"
                name="profile_photo"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className={`pt-2 sm:pt-1.5 text-[10px] sm:text-sm file:text-[10px] file:sm:text-sm cursor-pointer hover:bg-bglinkedin ${errors.profile_photo ? 'border-red-500' : ''}`}
              />
              {(profilePhoto || formData.profile_photo) && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleRemovePhoto}
                  className="w-20 flex-shrink-0 text-[10px] sm:text-sm"
                >
                  <Trash className="h-1 w-1 sm:h-4 sm:w-4" />
                  <span className="sr-only">Remove photo</span>
                </Button>
              )}
            </div>
            {errors.profile_photo && <p className="text-red-500 text-[8px] sm:text-xs">{errors.profile_photo}</p>}
          </div>
          <DialogFooter className="sm:pt-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto h-8 border-2 border-bluelinkedin text-bluelinkedin bg-white rounded-full hover:bg-bluelinkedin hover:text-white hover:scale-105 text-[10px] sm:text-sm mt-2 sm:mt-0"
            >
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

