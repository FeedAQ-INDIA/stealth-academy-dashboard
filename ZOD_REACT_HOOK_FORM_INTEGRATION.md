# Zod with React Hook Form Integration

This implementation demonstrates how to use Zod schema validation with React Hook Form in the CourseRoomMembers component.

## Key Features

### 1. Zod Schema Definition
Located in `src/utils/validationSchemas.js`:

```javascript
export const inviteMembersSchema = z.object({
  emailAddresses: z
    .string()
    .min(1, 'Please enter at least one email address')
    .refine((emails) => {
      const emailArray = emails
        .split(';')
        .map(email => email.trim())
        .filter(email => email.length > 0);
      
      if (emailArray.length === 0) {
        return false;
      }
      
      // Validate each email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailArray.every(email => emailRegex.test(email));
    }, 'Please enter valid email addresses separated by semicolons (;)'),
  message: z
    .string()
    .optional()
    .refine(
      (msg) => !msg || msg.length <= 500,
      'Message must be 500 characters or less'
    ),
});
```

### 2. React Hook Form Integration
In the CourseRoomMembers component:

```javascript
const form = useForm({
  resolver: zodResolver(inviteMembersSchema),
  defaultValues: {
    emailAddresses: "",
    message: "",
  },
});
```

### 3. Form Validation Features

- **Real-time validation**: Validates email format and semicolon separation
- **Custom refinement**: Checks each email address individually
- **Error messages**: Provides clear feedback for validation errors
- **Email counting**: Shows number of valid emails ready to send
- **Form state management**: Handles loading states and form reset

### 4. Usage in JSX

```jsx
<Form {...form}>
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
    <FormField
      control={form.control}
      name="emailAddresses"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email Addresses</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Enter email addresses separated by semicolons (;)"
              rows={4}
              className="w-full resize-none"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Tip: You can paste multiple emails from Excel or other sources. 
            Separate each email with a semicolon (;)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    
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
  </form>
</Form>
```

## Benefits

1. **Type Safety**: Zod provides runtime type checking and TypeScript integration
2. **Validation Logic**: Complex validation rules defined in reusable schemas
3. **Error Handling**: Automatic error message display with FormMessage
4. **Form State**: React Hook Form manages form state efficiently
5. **User Experience**: Real-time feedback and validation
6. **Reusability**: Schema can be used across different components

## Testing the Implementation

You can test the form with various inputs:

- **Valid**: `user1@example.com; user2@test.com; user3@domain.org`
- **Invalid**: `invalid-email; user@; @domain.com`
- **Mixed**: `valid@email.com; invalid-email; another@valid.com`

The form will show validation errors for invalid emails and display the count of valid emails ready to send.