"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/lib/toast"

interface Drop {
  id: string
  title: string
  description: string
  dropDate: Date
}

interface SiteSettings {
  id: string
  closedMode: boolean
  closedModeDropId: string | null
}

export default function SiteSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [drops, setDrops] = useState<Drop[]>([])
  const [selectedDropId, setSelectedDropId] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsResponse, dropsResponse] = await Promise.all([
          fetch('/api/site-settings'),
          fetch('/api/drops')
        ])

        if (!settingsResponse.ok || !dropsResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const settingsData = await settingsResponse.json()
        const dropsData = await dropsResponse.json()

        setSettings(settingsData)
        setDrops(dropsData)

        if (settingsData?.closedModeDropId) {
          setSelectedDropId(settingsData.closedModeDropId)
        } else if (dropsData.length > 0) {
          setSelectedDropId(dropsData[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast.error("Failed to load settings. Please refresh the page.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleToggleClosedMode = async (checked: boolean) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          closedMode: checked,
          closedModeDropId: checked ? selectedDropId : null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update site settings')
      }

      const updatedSettings = await response.json()
      setSettings(updatedSettings)

      toast.success(checked ? "Site is now in closed mode" : "Site is now in normal mode")
    } catch (error) {
      console.error("Failed to update site mode:", error)
      toast.error("Failed to update site mode. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDropChange = (value: string) => {
    setSelectedDropId(value)
  }

  const handleSaveDropSelection = async () => {
    if (!settings) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          closedMode: settings.closedMode,
          closedModeDropId: selectedDropId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update site settings')
      }

      const updatedSettings = await response.json()
      setSettings(updatedSettings)

      toast.success("Drop selection updated successfully!")
    } catch (error) {
      console.error("Failed to update drop selection:", error)
      toast.error("Failed to update drop selection. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !settings) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Site Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Site Mode</CardTitle>
            <CardDescription>
              Control whether the site is in normal mode or closed mode for an upcoming drop
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="closed-mode">Closed Mode</Label>
                <p className="text-sm text-gray-500">
                  When enabled, visitors will only see a countdown to the selected drop
                </p>
              </div>
              <Switch
                id="closed-mode"
                checked={settings.closedMode}
                onCheckedChange={handleToggleClosedMode}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="flex items-center">
              {settings.closedMode ? (
                <div className="flex items-center text-amber-600">
                  <EyeOff className="h-4 w-4 mr-2" />
                  <span>Site is in closed mode</span>
                </div>
              ) : (
                <div className="flex items-center text-green-600">
                  <Eye className="h-4 w-4 mr-2" />
                  <span>Site is in normal mode</span>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>

        {settings.closedMode && (
          <Card>
            <CardHeader>
              <CardTitle>Featured Drop</CardTitle>
              <CardDescription>Select which drop to feature on the closed site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="drop-select">Select Drop</Label>
                  <Select value={selectedDropId} onValueChange={handleDropChange}>
                    <SelectTrigger id="drop-select">
                      <SelectValue placeholder="Select a drop" />
                    </SelectTrigger>
                    <SelectContent>
                      {drops.map((drop) => (
                        <SelectItem key={drop.id} value={drop.id}>
                          {drop.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button
                onClick={handleSaveDropSelection}
                disabled={isLoading}
                className="bg-black text-gold hover:bg-gold hover:text-black"
              >
                Save Selection
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
