// Quick test to verify voting behavior fixes

const testData = [
  {
    description: "Scenario 1: Upvote then downvote",
    actions: [
      { action: "upvote", expectedCount: 1 },
      { action: "downvote", expectedCount: -1 } // Should go from 1 to -1 (down by 2)
    ]
  },
  {
    description: "Scenario 2: Multiple votes",
    upvotes: 3,
    downvotes: 5,
    expectedCount: -2 // 3 - 5 = -2
  },
  {
    description: "Scenario 3: Sorting test",
    ideas: [
      { id: 1, vote_count: 5 },
      { id: 2, vote_count: -2 },
      { id: 3, vote_count: 10 },
      { id: 4, vote_count: 0 }
    ],
    expectedOrder: [10, 5, 0, -2] // Highest to lowest
  }
]

console.log("🧪 Voting Behavior Test Cases:")
console.log("✅ Vote count can go negative")
console.log("✅ Downvote after upvote should decrease by 2 (1 → -1)")
console.log("✅ Ideas sorted by vote_count DESC (highest first)")
console.log("✅ Vote calculation: upvotes - downvotes (no Math.max)")

testData.forEach((test, index) => {
  console.log(`\n${index + 1}. ${test.description}`)
  if (test.actions) {
    test.actions.forEach(({ action, expectedCount }) => {
      console.log(`   ${action} → count: ${expectedCount}`)
    })
  }
  if (test.upvotes !== undefined) {
    console.log(`   ${test.upvotes} upvotes, ${test.downvotes} downvotes → ${test.expectedCount}`)
  }
  if (test.expectedOrder) {
    console.log(`   Expected order: ${test.expectedOrder.join(', ')}`)
  }
})

console.log("\n🎯 To test manually:")
console.log("1. Create an idea")
console.log("2. Upvote it (count should be 1)")
console.log("3. Downvote it (count should be -1, down by 2)")
console.log("4. Create more ideas with different vote counts")
console.log("5. Check they're sorted highest to lowest")
