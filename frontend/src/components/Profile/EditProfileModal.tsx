'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, X } from 'lucide-react'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  initialData: {
    username: string
    name: string
    work_history: string
    skills: string
    profile_photo?: string
  }
}

interface FormErrors {
  username?: string
  name?: string
  work_history?: string
  skills?: string
  profile_photo?: string
  general?: string
}

export function EditProfileModal({ isOpen, onClose, initialData }: EditProfileModalProps) {
  const [formData, setFormData] = useState(initialData)
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0])
      setErrors(prev => ({ ...prev, profile_photo: '' }))
    }
  }

  const handleRemovePhoto = () => {
    setProfilePhoto(null)
    setFormData(prev => ({ ...prev, profile_photo: undefined }))
    const fileInput = document.getElementById('profile_photo') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.username.trim()) newErrors.username = 'Username is required'
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (profilePhoto && profilePhoto.size > 10 * 1024 * 1024) {
      newErrors.profile_photo = 'Profile photo must be less than 10MB'
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
    
    setIsLoading(false);
    console.log("FormData entries:");
    for (const [key, value] of submitData.entries()) {
      console.log(key, value);
    }
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[300px] sm:max-w-[425px] md:max-w-[600px] rounded-md">
        <DialogHeader>
          <DialogTitle className="text-center text-bluelinkedin text-lg sm:text-xl md:text-2xl">Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="text-[10px] sm:text-sm space-y-4">
          {errors.general && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}
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
            <Label htmlFor="work_history" className="text-[10px] sm:text-sm">Work History</Label>
            <Textarea
              id="work_history"
              name="work_history"
              value={formData.work_history}
              onChange={handleInputChange}
              rows={3}
              className={`text-[10px] sm:text-sm ${errors.work_history ? 'border-red-500' : ''}`}
            />
            {errors.work_history && <p className="text-red-500 text-[8px] sm:text-xs">{errors.work_history}</p>}
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
                  className="flex-shrink-0 text-[10px] sm:text-sm"
                >
                  <X className="h-1 w-1 sm:h-4 sm:w-4" />
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

