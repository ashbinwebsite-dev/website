-- ============================================================================
-- Seed Data — Ashbin Kafle Portfolio
-- ============================================================================
-- Run this after the initial schema migration to populate the database
-- with the existing portfolio content.
-- ============================================================================

-- Note: Replace the user_id with the actual user UUID after signup.
-- Find it with: SELECT id FROM auth.users LIMIT 1;
-- Then run: UPDATE public.profiles SET ... WHERE id = '<uuid>';

-- ============================================================================
-- 1. Profile
-- ============================================================================
-- After creating your admin account, update the profile:
-- UPDATE public.profiles
-- SET
--   full_name = 'Ashbin Kafle',
--   headline = 'Artist',
--   subheadline = 'Visual Storyteller',
--   tagline = 'Nature Observer',
--   hero_tagline = 'Painting quiet moments inspired by nature, memory, and light.',
--   bio_short = 'Ashbin Kafle is an artist based in Kathmandu, Nepal. His work explores the quiet relationship between light, memory, and terrain — translating the atmosphere of a place into compositions defined by restraint and intention.',
--   bio_long = 'Ashbin Kafle is an artist based in Kathmandu, Nepal. His work explores the quiet relationship between light, memory, and terrain — translating the atmosphere of a place into compositions defined by restraint and intention. Working primarily in oil and acrylic, each piece is a study in patience. Rather than documenting what he sees, Ashbin distills landscapes into their emotional essence: a dawn over the hills, the weight of mist before rain, the silence of a forest floor.',
--   about_intro_heading = 'Living Through Landscapes',
--   about_intro = 'For Ashbin Kafle, landscape painting has never been about documentation. It is a quiet practice of attention — of standing still long enough to feel the atmosphere of a place and translating that feeling into colour, edge, and texture.

-- Growing up surrounded by the hills and open skies of Nepal shaped a visual language rooted in observation. Rather than reproducing what he sees, Ashbin distills landscapes into their essence — light hitting a ridge at dawn, the weight of mist before rain, the silence of a forest floor.

-- Painting became the natural extension of this way of seeing. It is not about escape, but about presence. A way of holding onto moments that would otherwise dissolve.',
--   process_description = 'In the studio, each painting begins with observation — time spent with sketches, colour studies, and notes before a single brushstroke touches the canvas. Ashbin works slowly, building layers in oil and acrylic, allowing each piece to reveal itself over weeks rather than hours.

-- Natural light guides the palette. The materials — canvas, linen, pigment — are chosen for their ability to hold texture and depth. The process is as much about patience as it is about intention, with each painting finding its own rhythm.',
--   contact_email = 'hello@ashbinkafle.com',
--   location = 'Kathmandu, Nepal',
--   hero_image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85&auto=format&fit=crop',
--   about_image_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80&auto=format&fit=crop'
-- WHERE id = '<your-user-uuid>';

-- ============================================================================
-- 2. Artworks
-- ============================================================================
-- After creating your admin account, insert artworks:
-- INSERT INTO public.artworks (user_id, slug, title, year, medium, description, availability, image_url, image_alt, featured, published, sort_order) VALUES
-- ('<uuid>', 'morning-light-over-ridge', 'Morning Light Over Ridge', 2024, 'Oil on canvas', 'A study in soft luminosity and atmospheric depth. The play of early morning light across layered terrain creates a quiet moment of contemplation.', 'available', 'https://picsum.photos/1200/1400?random=1', 'Morning Light Over Ridge - landscape painting with warm golden light', true, true, 0),
-- ('<uuid>', 'pine-forest-afternoon', 'Pine Forest Afternoon', 2024, 'Oil on canvas', 'Dense forest composition rendered in subtle greens and muted tones. Light filters through the canopy, creating areas of soft contrast.', 'available', 'https://picsum.photos/1000/1300?random=2', 'Pine Forest Afternoon - forest landscape with diffused light', true, true, 1),
-- ('<uuid>', 'river-study-dawn', 'River Study — Dawn', 2024, 'Acrylic on linen', 'A minimal composition centered on the movement of water and the interplay of light and shadow.', 'sold', 'https://picsum.photos/1000/800?random=3', 'River Study Dawn - misty river landscape at sunrise', true, true, 2),
-- ('<uuid>', 'coastal-mist-study', 'Coastal Mist Study', 2023, 'Oil on canvas', 'Soft palette study exploring atmosphere and horizon. The boundary between sky and sea dissolves into unified tone.', 'available', 'https://picsum.photos/1100/1400?random=4', 'Coastal Mist Study - ethereal seascape with fog and soft light', true, true, 3),
-- ('<uuid>', 'meadow-field-light', 'Meadow Field — Light', 2023, 'Oil on canvas', 'Open landscape anchored by texture and gentle color variation. The work explores spatial depth through restraint.', 'commissioned', 'https://picsum.photos/800/1000?random=5', 'Meadow Field Light - open golden field at soft sunset', true, true, 4),
-- ('<uuid>', 'mountain-silence-dusk', 'Mountain Silence — Dusk', 2023, 'Acrylic on linen', 'Large format study of mountain form rendered in understated palette. Emphasis on edge and subtle tonal transitions.', 'available', 'https://picsum.photos/1300/1000?random=6', 'Mountain Silence Dusk - minimalist mountain landscape', true, true, 5),
-- ('<uuid>', 'forest-edge-study', 'Forest Edge Study', 2023, 'Oil on canvas', 'The boundary between forest and clearing explored through layered composition and nuanced color.', 'available', 'https://picsum.photos/950/1250?random=7', 'Forest Edge Study - treeline with soft evening light', true, true, 6),
-- ('<uuid>', 'water-reflection-calm', 'Water Reflection — Calm', 2023, 'Oil on canvas', 'Study of reflection and stillness. Minimal intervention with color; emphasis on light and surface.', 'available', 'https://picsum.photos/1000/1200?random=8', 'Water Reflection Calm - still water reflecting sky', true, true, 7),
-- ('<uuid>', 'valley-morning-mist', 'Valley — Morning Mist', 2022, 'Acrylic on linen', 'Early morning composition with fog settling into terrain. Layered space created through tonal variation and soft edges.', 'sold', 'https://picsum.photos/1150/900?random=9', 'Valley Morning Mist - foggy valley with soft light', true, true, 8),
-- ('<uuid>', 'field-horizon-line', 'Field — Horizon Line', 2022, 'Oil on canvas', 'Minimalist composition with emphasis on horizon as formal element. Subtle color shifts create spatial depth.', 'available', 'https://picsum.photos/800/1100?random=10', 'Field Horizon Line - flat landscape with distinct horizon', true, true, 9),
-- ('<uuid>', 'cliff-face-study', 'Cliff Face Study', 2022, 'Oil on canvas', 'Vertical composition exploring texture and scale. The cliff rendered through careful observation of light and shadow.', 'available', 'https://picsum.photos/1250/950?random=11', 'Cliff Face Study - vertical rock formation', true, true, 10),
-- ('<uuid>', 'lake-reflection-evening', 'Lake Reflection — Evening', 2022, 'Acrylic on linen', 'Twilight study of lake surface reflecting sky. Composition emphasizes horizontal planes and soft color transitions.', 'commissioned', 'https://picsum.photos/1000/1300?random=12', 'Lake Reflection Evening - calm lake at dusk', true, true, 11);

-- ============================================================================
-- 3. Experience / Milestones
-- ============================================================================
-- INSERT INTO public.experience (user_id, year, label, sort_order) VALUES
-- ('<uuid>', '2020', 'Started painting professionally', 0),
-- ('<uuid>', '2022', 'First solo exhibition', 1),
-- ('<uuid>', '2023', 'Landscape series — full collection', 2),
-- ('<uuid>', '2025', 'Current collection & commissions', 3);

-- ============================================================================
-- 4. Social Links
-- ============================================================================
-- INSERT INTO public.social_links (user_id, platform, label, url, sort_order) VALUES
-- ('<uuid>', 'instagram', 'Instagram', 'https://instagram.com/ashbinkafle', 0),
-- ('<uuid>', 'email', 'Email', 'mailto:hello@ashbinkafle.com', 1);

-- ============================================================================
-- 5. Site Settings
-- ============================================================================
-- INSERT INTO public.site_settings (user_id, key, value) VALUES
-- (NULL, 'site_metadata', '{"title": "Ashbin Kafle — Artist", "description": "A premium portfolio experience for artist Ashbin Kafle. Minimal, editorial, and immersive."}'::jsonb),
-- (NULL, 'home_quote', '{"text": "I don\'t paint landscapes as they appear. I paint how they are remembered.", "attribution": "Ashbin Kafle"}'::jsonb),
-- (NULL, 'about_quote', '{"text": "I don\'t paint places exactly as they are. I paint the feeling of standing there.", "attribution": "Ashbin Kafle"}'::jsonb),
-- (NULL, 'available_for', '{"items": "Commissions, Exhibitions, Collaborations, Landscape Projects"}'::jsonb);
