export default {
  // Common
  common: {
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    done: 'Done',
    min: 'min',
    user: 'User',
  },

  // Landing
  landing: {
    badge: 'Recipe Roulette',
    title: 'Ricetta',
    subtitle: 'What should we cook today?',
    signIn: 'Sign in with Google',
    signInFailed: 'Sign-In Failed',
    signInError: 'Something went wrong.',
    feature1Title: 'Organize Your Recipes',
    feature1Desc: 'Group your favorite recipes into custom collections.',
    feature2Title: 'Random Pick',
    feature2Desc: 'Not sure what to cook? Let Ricetta choose one for you.',
    feature3Title: 'Cook with Confidence',
    feature3Desc: 'Step-by-step instructions for every recipe.',
  },

  // Home
  home: {
    subtitle: 'What are we cooking today?',
    emptyTitle: 'No groups yet',
    emptySubtitle: 'Create your first recipe group to get started!',
    createGroup: 'Create Group',
    deleteGroupTitle: 'Delete Group',
    deleteGroupMessage: 'Delete "%{name}" and all its recipes?',
  },

  // Group detail
  group: {
    emptyTitle: 'No recipes yet',
    emptySubtitle: 'Add your first recipe to this group!',
    noMatchTitle: 'No matching recipes',
    noMatchSubtitle: 'Try changing the difficulty filter.',
    addRecipe: 'Add Recipe',
  },

  // Recipe detail
  recipe: {
    ingredients: 'Ingredients',
    steps: 'Steps',
    deleteRecipe: 'Delete Recipe',
    deleteTitle: 'Delete Recipe',
    deleteMessage: 'Delete "%{name}"?',
  },

  // Settings
  settings: {
    title: 'Settings',
    signOut: 'Sign Out',
    signOutMessage: 'Are you sure you want to sign out?',
    language: 'Language',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
  },

  // Group form
  groupForm: {
    newTitle: 'New Group',
    editTitle: 'Edit Group',
    nameLabel: 'Group Name',
    namePlaceholder: 'e.g. Breakfast, Dinner...',
    emojiLabel: 'Emoji',
  },

  // Recipe form
  recipeForm: {
    newTitle: 'New Recipe',
    editTitle: 'Edit Recipe',
    nameLabel: 'Recipe Name',
    namePlaceholder: 'e.g. Chicken Stir-Fry',
    timeLabel: 'Estimated Time (minutes)',
    timePlaceholder: 'e.g. 30',
    difficultyLabel: 'Difficulty',
    ingredientsLabel: 'Ingredients',
    ingredientsPlaceholder: 'One ingredient per line',
    stepsLabel: 'Steps',
    stepsPlaceholder: 'One step per line',
    copyPrompt: 'Copy AI Prompt',
    copied: 'Copied!',
    importJson: 'Import JSON',
    import: 'Import',
    pasteJsonPlaceholder: 'Paste the JSON from your AI here...',
    importError: 'Invalid JSON',
    importErrorMessage:
      'Could not parse the JSON. Make sure it matches the expected format.',
  },

  // Ricetta modal
  ricetta: {
    destiny: 'Destiny has spoken!',
    letsCook: "Let's Cook!",
    ricettaAgain: 'Ricetta Again 🎲',
    ricetta: 'Ricetta',
  },

  // Difficulty
  difficulty: {
    all: 'All',
    Easy: 'Easy',
    Medium: 'Medium',
    Hard: 'Hard',
  },

  // Recipe count (pluralization)
  recipeCount: {
    one: '%{count} recipe',
    other: '%{count} recipes',
  },
};
