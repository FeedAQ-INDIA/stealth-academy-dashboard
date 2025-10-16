import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inviteMembersSchema } from '@/utils/validationSchemas.js';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Loader2, Send } from 'lucide-react';

// Standalone Invite Members Form Component
export function InviteMembersForm({ 
  onSubmit, 
  isLoading = false, 
  onCancel,
  className = "" 
}) {
  const form = useForm({
    resolver: zodResolver(inviteMembersSchema),
    defaultValues: {
      emailAddresses: "",
      message: "",
    },
  });

  const { 
    handleSubmit, 
    formState: { isSubmitting },
    reset,
    watch,
  } = form;

  // Watch email addresses for real-time validation and count
  const watchedEmails = watch("emailAddresses");

  // Get email count for display
  const getEmailCount = (emailString) => {
    if (!emailString) return 0;
    return emailString
      .split(';')
      .map(email => email.trim())
      .filter(email => email && email.includes('@')).length;
  };

  // Handle form submission
  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset(); // Reset form on successful submission
    } catch (error) {
      // Error handling is done by parent component
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  const isSubmittingForm = isSubmitting || isLoading;

  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Email Addresses Section */}
          <FormField
            control={form.control}
            name="emailAddresses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Addresses</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter email addresses separated by semicolons (;)&#10;Example: user1@email.com; user2@email.com; user3@email.com"
                    rows={4}
                    className="w-full resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Tip: You can paste multiple emails from Excel or other sources. Separate each email with a semicolon (;)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Optional Message Section */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Message (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add a personal message to your invitation..."
                    rows={3}
                    className="w-full resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This message will be included in the invitation email
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Count Display */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              {getEmailCount(watchedEmails)} email(s) ready to send
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isSubmittingForm}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmittingForm || !watchedEmails?.trim()}
              className="flex-1"
            >
              {isSubmittingForm ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitations
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default InviteMembersForm;