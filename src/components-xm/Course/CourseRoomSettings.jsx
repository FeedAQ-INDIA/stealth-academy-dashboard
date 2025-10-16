import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Settings, Bell, Shield, Lock, Eye, Save } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Label } from "@/components/ui/label.jsx";
import { useState } from "react";
import { useCourse } from "@/components-xm/Course/CourseContext.jsx";
import { useAuthStore } from "@/zustland/store.js";

function CourseRoomSettings() {
  const { courseList } = useCourse();
  const { userDetail } = useAuthStore();

  // Check if user is course owner or moderator
  const isCourseOwner = courseList?.userId === userDetail?.userId;
  const [isModerator] = useState(false); // This should come from actual member data

  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    roomDescription: "Welcome to our course room! This is a space for collaboration and learning.",
    isPublic: false,
    allowMemberInvites: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    newMemberNotification: true,
    
    // Permission Settings
    membersCanCreateDiscussions: true,
    membersCanUploadResources: false,
    moderationRequired: false,
    
    // Privacy Settings
    showMemberList: true,
    showOnlineStatus: true,
    allowDirectMessages: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save settings logic here
      console.log("Saving settings:", settings);
      // API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // If user doesn't have permission to access settings
  if (!isCourseOwner && !isModerator) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Access Restricted
        </h2>
        <p className="text-gray-600">
          Only course owners and moderators can access course room settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
   

      {/* General Settings */}
      <Card className="border-0 bg-white shadow-sm rounded-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Settings className="h-5 w-5 text-blue-600" />
            General Settings
          </CardTitle>
 
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Room Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your course room..."
              rows={4}
              value={settings.roomDescription}
              onChange={(e) => updateSetting('roomDescription', e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              This description will be visible to all members
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Public Course Room</Label>
              <p className="text-xs text-gray-500">Allow anyone to discover and join this room</p>
            </div>
            <Switch
              checked={settings.isPublic}
              onCheckedChange={(checked) => updateSetting('isPublic', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Allow Member Invites</Label>
              <p className="text-xs text-gray-500">Let members invite others to the room</p>
            </div>
            <Switch
              checked={settings.allowMemberInvites}
              onCheckedChange={(checked) => updateSetting('allowMemberInvites', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-0 bg-white shadow-sm rounded-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Bell className="h-5 w-5 text-blue-600" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Email Notifications</Label>
              <p className="text-xs text-gray-500">Receive email updates about room activity</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Push Notifications</Label>
              <p className="text-xs text-gray-500">Get instant notifications for important updates</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Weekly Digest</Label>
              <p className="text-xs text-gray-500">Receive a summary of weekly activity</p>
            </div>
            <Switch
              checked={settings.weeklyDigest}
              onCheckedChange={(checked) => updateSetting('weeklyDigest', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">New Member Notifications</Label>
              <p className="text-xs text-gray-500">Get notified when new members join</p>
            </div>
            <Switch
              checked={settings.newMemberNotification}
              onCheckedChange={(checked) => updateSetting('newMemberNotification', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Permission Settings */}
      <Card className="border-0 bg-white shadow-sm rounded-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Shield className="h-5 w-5 text-blue-600" />
            Permission Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Members Can Create Discussions</Label>
              <p className="text-xs text-gray-500">Allow members to start new discussion threads</p>
            </div>
            <Switch
              checked={settings.membersCanCreateDiscussions}
              onCheckedChange={(checked) => updateSetting('membersCanCreateDiscussions', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Members Can Upload Resources</Label>
              <p className="text-xs text-gray-500">Let members share files and resources</p>
            </div>
            <Switch
              checked={settings.membersCanUploadResources}
              onCheckedChange={(checked) => updateSetting('membersCanUploadResources', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Moderation Required</Label>
              <p className="text-xs text-gray-500">Require moderator approval for posts</p>
            </div>
            <Switch
              checked={settings.moderationRequired}
              onCheckedChange={(checked) => updateSetting('moderationRequired', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="border-0 bg-white shadow-sm rounded-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Eye className="h-5 w-5 text-blue-600" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Show Member List</Label>
              <p className="text-xs text-gray-500">Display list of all room members</p>
            </div>
            <Switch
              checked={settings.showMemberList}
              onCheckedChange={(checked) => updateSetting('showMemberList', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Show Online Status</Label>
              <p className="text-xs text-gray-500">Display when members are online</p>
            </div>
            <Switch
              checked={settings.showOnlineStatus}
              onCheckedChange={(checked) => updateSetting('showOnlineStatus', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Allow Direct Messages</Label>
              <p className="text-xs text-gray-500">Enable private messaging between members</p>
            </div>
            <Switch
              checked={settings.allowDirectMessages}
              onCheckedChange={(checked) => updateSetting('allowDirectMessages', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Room Management (Owner Only) */}
      {/* {isCourseOwner && (
        <Card className="border-0 bg-white shadow-sm rounded-sm border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 text-xl font-semibold text-gray-800">
              <Lock className="h-5 w-5" />
              Room Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-800 mb-2">Danger Zone</h4>
              <p className="text-sm text-red-700 mb-4">
                These actions are permanent and cannot be undone.
              </p>
              <div className="space-y-3">
                <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                  Archive Course Room
                </Button>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto ml-0 sm:ml-2">
                  Delete Course Room
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default CourseRoomSettings;