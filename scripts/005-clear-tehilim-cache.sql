-- Clear all cached tehilim data to refetch with proper formatting
DELETE FROM tehilim_cache;

-- Reset reading progress if needed
-- DELETE FROM tehilim_reading_progress;

-- Confirm deletion
SELECT 'Tehilim cache cleared successfully' as status;
