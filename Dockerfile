# Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
# For more information, please see https://aka.ms/containercompat

#FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8-windowsservercore-ltsc2019
#ARG source
#WORKDIR /inetpub/wwwroot
#COPY ${source:-obj/Docker/publish} .

# === Giai đoạn 1: Build ứng dụng ===
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Sao chép file .csproj và .sln để restore dependencies
# Điều này giúp tối ưu hóa cache của Docker
COPY ["*.sln", "./"]
COPY ["Nhom-30-DeTai7-Web_Dat_Ve-Xe-Tau-May_Bay/*.csproj", "./Nhom-30-DeTai7-Web_Dat_Ve-Xe-Tau-May_Bay/"]
RUN dotnet restore "./Nhom-30-DeTai7-Web_Dat_Ve-Xe-Tau-May_Bay.sln"

# Sao chép toàn bộ source code còn lại
COPY . .
WORKDIR "/src/Nhom-30-DeTai7-Web_Dat_Ve-Xe-Tau-May_Bay"

# <<< THAY ĐỔI QUAN TRỌNG Ở ĐÂY
# Chỉ định rõ project cần publish
RUN dotnet publish "Nhom-30-DeTai7-Web_Dat_Ve-Xe-Tau-May_Bay.csproj" -c Release -o /app/publish

# === Giai đoạn 2: Chạy ứng dụng ===
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Nhom-30-DeTai7-Web_Dat_Ve-Xe-Tau-May_Bay.dll"]
