# Run SQL Scripts

To finalize the database changes for Verification features, run the following scripts in your Supabase SQL Editor:

1. `database/update_verification_schema.sql`
   - Adds Personal Info fields (DOB, NOK) to `user_profiles`.
   - Adds `document_number` to `verification_documents`.

2. `database/add_rejection_reason.sql`
   - Adds `rejection_reason` column to `verification_documents`.
