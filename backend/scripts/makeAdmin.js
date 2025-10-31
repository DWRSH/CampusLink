import dotenv from 'dotenv'
import connectDb from '../config/db.js'
import User from '../models/user.model.js'

dotenv.config()

const arg = process.argv[2]
if (!arg) {
  console.log('Usage: node scripts/makeAdmin.js <email|userId>')
  process.exit(1)
}

const run = async () => {
  try {
    await connectDb()

    let user
    if (arg.includes('@')) {
      user = await User.findOne({ email: arg })
    } else {
      user = await User.findById(arg)
    }

    if (!user) {
      console.log('User not found')
      process.exit(1)
    }

    user.isAdmin = true
    await user.save()
    console.log(`Success: ${user.email || user._id} is now an admin`)
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

run()