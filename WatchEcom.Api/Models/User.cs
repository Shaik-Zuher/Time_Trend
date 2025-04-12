//namespace used to group different tables or models.
//namespace name can be anything
namespace WatchEcom.Api.Models
{
    public class User
{
    public int Id { get; set; }
    //public string Email {get;set;}=string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Security_Question{get; set;}=string.Empty;
}
}
//One namespace can have differnt classes but it easy to maintain with differnt files.