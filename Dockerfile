# Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
# For more information, please see https://aka.ms/containercompat

#FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8-windowsservercore-ltsc2019
#ARG source
#WORKDIR /inetpub/wwwroot
#COPY ${source:-obj/Docker/publish} .

# === Giai doan 1: Build ung dung => Bat dau tu day ===
# Su dung .NET 7 SDK image de build, co the doi version neu can (vi du: 6.0, 8.0)
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Sao chep file .csproj va restore cac package can thiet
# Dau * giup no hoat dong du ten project cua ban la gi
COPY ["*.csproj", "./"]
RUN dotnet restore

# Sao chep toan code con lai va tien trinh publish
COPY . .
RUN dotnet publish -c Release -o /app/publish

# === Giai đoan 2: Chay ung dụng ===
# Su dung .NET 7 ASP.NET runtime image nho hon de chay
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/publish .

# THAY ten FILE DLL vao day
ENTRYPOINT ["dotnet", "Nhom-30-DeTai7-Web_Dat_Ve-Xe-Tau-May_Bay.dll"]
