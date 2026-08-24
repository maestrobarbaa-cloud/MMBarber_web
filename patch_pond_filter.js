const fs = require('fs');
const path = require('path');

const pondPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'Pond.tsx');
let content = fs.readFileSync(pondPath, 'utf8');

const targetContent = `  useEffect(() => {
    let filtered = [...allProfiles];

    // Filter by Discovery Hub subCategories
    if (searchFilters.subCategories.length > 0) {
      filtered = filtered.filter(p => {
        if (p.id === 'ad-1') return true;
        const profileCategories = p.categories || [];
        return searchFilters.subCategories.some(filterCat => profileCategories.includes(filterCat));
      });
    }

    // Filter by Account Type
    if (accountFilter !== 'all') {
      filtered = filtered.filter(p => p.id === 'ad-1' || p.accountType === accountFilter);
    }

    setProfiles(filtered);
    setResetKey(prev => prev + 1);
  }, [searchFilters, accountFilter, allProfiles]);`;

const newContent = `  useEffect(() => {
    let filtered = [...allProfiles];

    // Filter by Discovery Hub subCategories
    if (searchFilters.subCategories.length > 0) {
      filtered = filtered.filter(p => {
        if (p.id === 'ad-1') return true;
        const profileCategories = p.categories || [];
        return searchFilters.subCategories.some(filterCat => profileCategories.includes(filterCat));
      });
    }

    // Filter by Account Type
    if (accountFilter !== 'all') {
      filtered = filtered.filter(p => p.id === 'ad-1' || p.accountType === accountFilter);
    }

    // Filter by Distance (Nearest algorithm implementation)
    if (maxDistance !== undefined) {
      filtered = filtered.filter(p => {
        if (p.id === 'ad-1') return true; // Keep ads
        if (p.distanceFromUser === undefined) return true; // Keep mock profiles that don't have distance
        
        if (distanceMode === 'max') {
          return p.distanceFromUser <= maxDistance;
        } else {
          return p.distanceFromUser > maxDistance;
        }
      });
    }

    setProfiles(filtered);
    setResetKey(prev => prev + 1);
  }, [searchFilters, accountFilter, maxDistance, distanceMode, allProfiles]);`;

content = content.replace(targetContent, newContent);
fs.writeFileSync(pondPath, content);
console.log('Done patching filtering logic in Pond.tsx');
