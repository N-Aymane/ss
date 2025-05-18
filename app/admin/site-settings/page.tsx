"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getDrops, getSiteSettings, toggleClosedMode } from "@/lib/drops"
import { useToast } from "@/components/ui/use-toast"

export default function SiteSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState({ closedMode: false, closedModeDropId: null })
  const [drops, setDrops] = useState([])
  const [selectedDropId, setSelectedDropId] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, dropsData] = await Promise.all([getSiteSettings(), getDrops()])

        setSettings(settingsData)
        setDrops(dropsData)

        if (settingsData.closedModeDropId) {
          setSelectedDropId(settingsData.closedModeDropId)
        } else if (dropsData.length > 0) {
          setSelectedDropId(dropsData[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleToggleClosedMode = async (checked) => {
    setIsLoading(true)
    try { 
      const updatedSettings = await toggleClosedMode(checked, checked ? selectedDropId : null)
      setSettings(updatedSettings)

      toast({
        title: checked ? "Site is now in closed mode" : "Site is now in normal mode",
        description: checked ? "Visitors will only see the countdown timer" : "Visitors can now access the full site",
        duration: 3000,
      })
    } catch (error) {
      console.error("Failed to update site mode:", error)
      toast({
        title: "Error updating site mode",
        description: "Please try again",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDropChange = (value) => {
    setSelectedDropId(value)
  }

  const handleSaveDropSelection = async () => {
    setIsLoading(true)
    try {
      const updatedSettings = await toggleClosedMode(settings.closedMode, selectedDropId)
      setSettings(updatedSettings)

      toast({
        title: "Drop selection updated",
        description: "The selected drop will be featured on the closed site",
        duration: 3000,
      })
    } catch (error) {
      console.error("Failed to update drop selection:", error)
      toast({
        title: "Error updating drop selection",
        description: "Please try again",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
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
