Write-Host "=== Iniciando configuração automática do projeto SBCOM ==="

# 1️⃣ Configurar rede npm para evitar timeouts
Write-Host "[1/7] Ajustando configuração de rede do npm..."
npm config set registry https://registry.npmjs.org/
npm config set fetch-timeout 600000
npm config set fetch-retries 5
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000

# 2️⃣ Remover caches e pastas antigas (se existirem)
Write-Host "[2/7] Limpando ambiente antigo..."
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }
npm cache clean --force

# 3️⃣ Instalar dependências principais
Write-Host "[3/7] Instalando dependências principais (expo, react, react-native)..."
npm install expo react react-dom react-native

# 4️⃣ Instalar bibliotecas do Expo necessárias
Write-Host "[4/7] Instalando libs essenciais do Expo..."
npx expo install react-native-screens react-native-safe-area-context

# 5️⃣ Instalar React Navigation (rotas)
Write-Host "[5/7] Instalando React Navigation..."
npm install @react-navigation/native @react-navigation/native-stack

# 6️⃣ Instalar componentes visuais e utilitários
Write-Host "[6/7] Instalando bibliotecas visuais e utilitárias..."
npm install react-native-paper react-native-vector-icons axios

# 7️⃣ Confirmar tudo instalado
Write-Host "[7/7] Instalações concluídas! Iniciando o Expo..."
npx expo start -c
