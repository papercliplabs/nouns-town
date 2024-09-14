# Scripts to automate some things for Nouns Town

## Send direct casts on Warpcast to all users on the frame waitlist

1. Update `UUID` and `MESSAGE` in `./src/app/direct-cast/main.ts`

2. Send direct casts, this sends 5 per minute (WC rate limit), so will take awhile to get to everyone
```bash
pn dev:direct-cast
```

