param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$CliArgs
)

docker compose exec api npm run cli -- @CliArgs